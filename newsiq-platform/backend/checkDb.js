const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

(async () => {
  try {
    // Check constraints on public.Bookmark and public.ReadingHistory
    const bookmarkConstraints = await p.$queryRaw`
      SELECT conname, pg_get_constraintdef(oid) as def
      FROM pg_constraint
      WHERE conrelid = 'public."Bookmark"'::regclass
    `;
    console.log('Bookmark constraints:', bookmarkConstraints);

    const historyConstraints = await p.$queryRaw`
      SELECT conname, pg_get_constraintdef(oid) as def
      FROM pg_constraint
      WHERE conrelid = 'public."ReadingHistory"'::regclass
    `;
    console.log('ReadingHistory constraints:', historyConstraints);

    const keywordAlertColumns = await p.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'KeywordAlert' AND table_schema = 'public'
    `;
    console.log('KeywordAlert columns:', keywordAlertColumns.map(c => `${c.column_name} (${c.data_type})`));
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await p.$disconnect();
  }
})();

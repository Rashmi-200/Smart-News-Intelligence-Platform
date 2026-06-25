import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/* ------------------------------------------------------------------ */
/*  GET /api/climate/news                                             */
/*  Articles filtered where category=climate/environment              */
/* ------------------------------------------------------------------ */
export async function getClimateNews(req: Request, res: Response) {
  try {
    const page   = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit  = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
    const skip   = (page - 1) * limit;

    const [articles, totalCount] = await Promise.all([
      prisma.article.findMany({
        where: {
          category: {
            in: ['Climate', 'climate', 'Environment', 'environment', 'Weather', 'weather'],
            mode: 'insensitive',
          },
        },
        orderBy: { scraped_at: 'desc' },
        skip,
        take: limit,
      }),
      prisma.article.count({
        where: {
          category: {
            in: ['Climate', 'climate', 'Environment', 'environment', 'Weather', 'weather'],
            mode: 'insensitive',
          },
        },
      }),
    ]);

    res.json({
      data: articles,
      page,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch climate news' });
  }
}

/* ------------------------------------------------------------------ */
/*  GET /api/climate/alerts                                           */
/*  Active disaster alerts (region, type, severity, message, isActive) */
/* ------------------------------------------------------------------ */
export async function getDisasterAlerts(req: Request, res: Response) {
  try {
    const alerts = await prisma.disasterAlert.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    if (alerts.length === 0) {
      // Premium mock fallback alerts for Sri Lanka
      const mockAlerts = [
        {
          id: 101,
          region: 'Western Province (Colombo/Gampaha)',
          type: 'Flood Alert',
          severity: 'High',
          message: 'Heavy rain warnings issued. Risk of minor flooding in low-lying areas near Kelani River.',
          isActive: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: 102,
          region: 'Kandy & Nuwara Eliya',
          type: 'Landslide Warning',
          severity: 'Medium',
          message: 'National Building Research Organisation (NBRO) issues level 2 landslide warning for mountainous regions due to continuous rainfall.',
          isActive: true,
          createdAt: new Date(Date.now() - 3600000 * 4).toISOString(), // 4 hours ago
        },
        {
          id: 103,
          region: 'Southern Coastal Waters (Galle/Matara)',
          type: 'Rough Seas',
          severity: 'Low',
          message: 'Wind speed could increase up to 50 kmph. Naval and fishing communities advised to remain vigilant.',
          isActive: true,
          createdAt: new Date(Date.now() - 3600000 * 12).toISOString(), // 12 hours ago
        },
      ];
      return res.json({ data: mockAlerts, source: 'mock_fallback' });
    }

    res.json({ data: alerts, source: 'database' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch disaster alerts' });
  }
}

/* ------------------------------------------------------------------ */
/*  GET /api/climate/weather/:city                                    */
/*  Mock weather structure for Colombo, Kandy, Jaffna, Galle          */
/* ------------------------------------------------------------------ */
export async function getWeather(req: Request, res: Response) {
  try {
    const cityParam = req.params.city.trim().toLowerCase();

    // Premium weather mock data repository
    const weatherRepository: Record<string, any> = {
      colombo: {
        city: 'Colombo',
        temperature: 29.8,
        humidity: 82,
        windSpeed: 16.2,
        windDirection: 'WSW',
        condition: 'Scattered Showers',
        uvIndex: 8,
        forecast: [
          { day: 'Friday', temp: 30, condition: 'Thunderstorms' },
          { day: 'Saturday', temp: 31, condition: 'Partly Cloudy' },
          { day: 'Sunday', temp: 31, condition: 'Sunny' },
        ],
      },
      kandy: {
        city: 'Kandy',
        temperature: 24.2,
        humidity: 88,
        windSpeed: 10.5,
        windDirection: 'SW',
        condition: 'Misty / Rain',
        uvIndex: 6,
        forecast: [
          { day: 'Friday', temp: 23, condition: 'Heavy Rain' },
          { day: 'Saturday', temp: 25, condition: 'Scattered Showers' },
          { day: 'Sunday', temp: 26, condition: 'Cloudy' },
        ],
      },
      jaffna: {
        city: 'Jaffna',
        temperature: 33.4,
        humidity: 65,
        windSpeed: 20.8,
        windDirection: 'SSW',
        condition: 'Sunny & Windy',
        uvIndex: 11,
        forecast: [
          { day: 'Friday', temp: 33, condition: 'Sunny' },
          { day: 'Saturday', temp: 34, condition: 'Clear Sky' },
          { day: 'Sunday', temp: 33, condition: 'Partly Cloudy' },
        ],
      },
      galle: {
        city: 'Galle',
        temperature: 28.6,
        humidity: 85,
        windSpeed: 24.0,
        windDirection: 'W',
        condition: 'Strong Winds / Light Rain',
        uvIndex: 7,
        forecast: [
          { day: 'Friday', temp: 28, condition: 'Rough Winds' },
          { day: 'Saturday', temp: 29, condition: 'Scattered Showers' },
          { day: 'Sunday', temp: 30, condition: 'Partly Cloudy' },
        ],
      },
    };

    const weatherData = weatherRepository[cityParam];

    if (!weatherData) {
      return res.status(404).json({
        message: `Weather data only available for: ${Object.values(weatherRepository)
          .map((w: any) => w.city)
          .join(', ')}`,
      });
    }

    res.json(weatherData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch weather details' });
  }
}

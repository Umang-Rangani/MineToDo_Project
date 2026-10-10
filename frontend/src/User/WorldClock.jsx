import React, { useEffect, useMemo, useState } from 'react'
import { Globe2, Search, Clock3, MapPin, Sun, Moon, ChevronDown, X } from 'lucide-react'

const COUNTRY_ZONES = [
  { country: 'India', flag: '🇮🇳', cities: ['Asia/Kolkata'] },
  { country: 'United States', flag: '🇺🇸', cities: ['America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles', 'America/Anchorage', 'Pacific/Honolulu'] },
  { country: 'United Kingdom', flag: '🇬🇧', cities: ['Europe/London'] },
  { country: 'United Arab Emirates', flag: '🇦🇪', cities: ['Asia/Dubai'] },
  { country: 'Japan', flag: '🇯🇵', cities: ['Asia/Tokyo'] },
  { country: 'Singapore', flag: '🇸🇬', cities: ['Asia/Singapore'] },
  { country: 'Australia', flag: '🇦🇺', cities: ['Australia/Sydney', 'Australia/Melbourne', 'Australia/Perth', 'Australia/Brisbane', 'Australia/Adelaide'] },
  { country: 'Canada', flag: '🇨🇦', cities: ['America/Toronto', 'America/Vancouver', 'America/Edmonton', 'America/Winnipeg', 'America/Halifax'] },
  { country: 'China', flag: '🇨🇳', cities: ['Asia/Shanghai', 'Asia/Urumqi'] },
  { country: 'Germany', flag: '🇩🇪', cities: ['Europe/Berlin'] },
  { country: 'France', flag: '🇫🇷', cities: ['Europe/Paris'] },
  { country: 'Italy', flag: '🇮🇹', cities: ['Europe/Rome'] },
  { country: 'Spain', flag: '🇪🇸', cities: ['Europe/Madrid'] },
  { country: 'Russia', flag: '🇷🇺', cities: ['Europe/Moscow', 'Asia/Yekaterinburg', 'Asia/Novosibirsk', 'Asia/Vladivostok'] },
  { country: 'Brazil', flag: '🇧🇷', cities: ['America/Sao_Paulo', 'America/Manaus', 'America/Fortaleza'] },
  { country: 'Mexico', flag: '🇲🇽', cities: ['America/Mexico_City', 'America/Cancun', 'America/Tijuana'] },
  { country: 'South Africa', flag: '🇿🇦', cities: ['Africa/Johannesburg'] },
  { country: 'New Zealand', flag: '🇳🇿', cities: ['Pacific/Auckland', 'Pacific/Chatham'] },
  { country: 'Thailand', flag: '🇹🇭', cities: ['Asia/Bangkok'] },
  { country: 'Indonesia', flag: '🇮🇩', cities: ['Asia/Jakarta', 'Asia/Makassar', 'Asia/Jayapura'] },
  { country: 'South Korea', flag: '🇰🇷', cities: ['Asia/Seoul'] },
  { country: 'Pakistan', flag: '🇵🇰', cities: ['Asia/Karachi'] },
  { country: 'Bangladesh', flag: '🇧🇩', cities: ['Asia/Dhaka'] },
  { country: 'Nepal', flag: '🇳🇵', cities: ['Asia/Kathmandu'] },
  { country: 'Sri Lanka', flag: '🇱🇰', cities: ['Asia/Colombo'] },
  { country: 'Saudi Arabia', flag: '🇸🇦', cities: ['Asia/Riyadh'] },
  { country: 'Turkey', flag: '🇹🇷', cities: ['Europe/Istanbul'] },
  { country: 'Egypt', flag: '🇪🇬', cities: ['Africa/Cairo'] },
  { country: 'Nigeria', flag: '🇳🇬', cities: ['Africa/Lagos'] },
  { country: 'Kenya', flag: '🇰🇪', cities: ['Africa/Nairobi'] },
  { country: 'Switzerland', flag: '🇨🇭', cities: ['Europe/Zurich'] },
  { country: 'Netherlands', flag: '🇳🇱', cities: ['Europe/Amsterdam'] },
  { country: 'Portugal', flag: '🇵🇹', cities: ['Europe/Lisbon'] },
  { country: 'Ireland', flag: '🇮🇪', cities: ['Europe/Dublin'] },
  { country: 'Malaysia', flag: '🇲🇾', cities: ['Asia/Kuala_Lumpur'] },
  { country: 'Philippines', flag: '🇵🇭', cities: ['Asia/Manila'] },
  { country: 'Vietnam', flag: '🇻🇳', cities: ['Asia/Ho_Chi_Minh'] },
  { country: 'Qatar', flag: '🇶🇦', cities: ['Asia/Qatar'] },
  { country: 'Israel', flag: '🇮🇱', cities: ['Asia/Jerusalem'] },
  { country: 'Argentina', flag: '🇦🇷', cities: ['America/Argentina/Buenos_Aires'] },
  { country: 'Chile', flag: '🇨🇱', cities: ['America/Santiago'] },
  { country: 'Colombia', flag: '🇨🇴', cities: ['America/Bogota'] },
  { country: 'Jamaica', flag: '🇯🇲', cities: ['America/Jamaica'] },
  { country: 'Iceland', flag: '🇮🇸', cities: ['Atlantic/Reykjavik'] },
  { country: 'Greece', flag: '🇬🇷', cities: ['Europe/Athens'] },
  { country: 'Sweden', flag: '🇸🇪', cities: ['Europe/Stockholm'] },
  { country: 'Norway', flag: '🇳🇴', cities: ['Europe/Oslo'] },
  { country: 'Denmark', flag: '🇩🇰', cities: ['Europe/Copenhagen'] },
  { country: 'Poland', flag: '🇵🇱', cities: ['Europe/Warsaw'] },
  { country: 'Ukraine', flag: '🇺🇦', cities: ['Europe/Kyiv'] },
  { country: 'Finland', flag: '🇫🇮', cities: ['Europe/Helsinki'] },
]

const getCity = (zone) => {
  const city = zone.split('/').pop().replaceAll('_', ' ')
  const names = {
    Kolkata: 'Kolkata',
    'New York': 'New York',
    'Los Angeles': 'Los Angeles',
    Chicago: 'Chicago',
    'Mexico City': 'Mexico City',
    'Sao Paulo': 'São Paulo',
    'Buenos Aires': 'Buenos Aires',
    'Ho Chi Minh': 'Ho Chi Minh City',
    'Kuala Lumpur': 'Kuala Lumpur',
    'Porto Novo': 'Porto-Novo',
    Urumqi: 'Ürümqi',
    Kyiv: 'Kyiv',
    'St Johns': "St. John's",
  }
  return names[city] || city
}

const getTime = (zone, date, use24Hour) =>
  new Intl.DateTimeFormat('en-US', {
    timeZone: zone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: !use24Hour,
  }).format(date)

const getDate = (zone, date) =>
  new Intl.DateTimeFormat('en-US', {
    timeZone: zone,
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)

const getOffset = (zone, date) =>
  new Intl.DateTimeFormat('en-US', {
    timeZone: zone,
    timeZoneName: 'longOffset',
  })
    .formatToParts(date)
    .find((part) => part.type === 'timeZoneName')
    ?.value.replace('GMT', 'UTC') || 'UTC'

const getHour = (zone, date) =>
  Number(
    new Intl.DateTimeFormat('en-US', {
      timeZone: zone,
      hour: 'numeric',
      hour12: false,
    }).format(date),
  ) % 24

export default function WorldClock() {
  const [now, setNow] = useState(() => new Date())
  const [search, setSearch] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('India')
  const [use24Hour, setUse24Hour] = useState(false)
  const [countryMenuOpen, setCountryMenuOpen] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const selected = COUNTRY_ZONES.find((item) => item.country === selectedCountry) || COUNTRY_ZONES[0]

  const searchResults = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return []

    return COUNTRY_ZONES.flatMap((country) =>
      country.cities
        .filter((zone) => {
          const city = getCity(zone).toLowerCase()
          return country.country.toLowerCase().includes(term) || city.includes(term)
        })
        .map((zone) => ({ ...country, zone, city: getCity(zone) })),
    )
  }, [search])

  const cards = useMemo(() => {
    if (search.trim()) return searchResults

    return selected.cities.map((zone) => ({
      ...selected,
      zone,
      city: getCity(zone),
    }))
  }, [selected, search, searchResults])

  const activeCountry = search.trim()
    ? searchResults.length === 1
      ? searchResults[0].country
      : searchResults.some((item) => item.country.toLowerCase().includes(search.trim().toLowerCase()))
        ? searchResults.find((item) => item.country.toLowerCase().includes(search.trim().toLowerCase())).country
        : 'Search results'
    : selected.country

  const activeFlag = COUNTRY_ZONES.find((item) => item.country === activeCountry)?.flag

  const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata'
  const localCountry = COUNTRY_ZONES.find((item) => item.cities.includes(localZone))?.country || 'Your local time'

  const localHour = getHour(localZone, now)
  const localNight = localHour < 6 || localHour >= 18

  return (
    <div
      className="flex h-full min-h-0 flex-col gap-3 overflow-y-auto overflow-x-hidden"
      style={{
        backgroundColor: 'var(--color-bg)',
        color: 'var(--color-text)',
      }}
    >
      <header
        className="sticky top-0 z-20 flex min-h-16 items-center justify-between gap-2 border-b px-1 py-2"
        style={{
          backgroundColor: 'var(--color-bg)',
          borderColor: 'var(--color-borderSoft)',
        }}
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{
              backgroundColor: 'var(--color-soft)',
              color: 'var(--color-primary)',
            }}
          >
            <Globe2 size={21} />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold sm:text-xl">World Clock</h1>
            <p className="hidden truncate text-xs sm:block" style={{ color: 'var(--color-muted)' }}>
              Live time around the world
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setUse24Hour((value) => !value)}
          className="inline-flex h-9 shrink-0 items-center gap-2 rounded-xl border px-3 text-sm font-medium"
          style={{
            backgroundColor: 'var(--color-card)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text)',
          }}
        >
          <Clock3 size={16} />
          <span>{use24Hour ? '24-hour' : '12-hour'}</span>
        </button>
      </header>

      <section
        className="relative flex min-h-36 shrink-0 items-center justify-between gap-3 overflow-hidden rounded-2xl p-4 sm:min-h-40 sm:px-6"
        style={{
          background: 'linear-gradient(115deg, var(--color-primaryDark), var(--color-primary), var(--color-secondary))',
          color: '#FFFFFF',
          boxShadow: '0 3px 10px rgba(0,0,0,0.06)',
        }}
      >
        <div className="pointer-events-none absolute -right-8 -top-14 h-44 w-44 rounded-full border-[22px] opacity-10" />
        <div className="relative min-w-0">
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
            <MapPin size={14} />
            Your local time
          </div>
          <p className="truncate text-sm opacity-90">{localCountry}</p>
          <div className="whitespace-nowrap text-3xl font-bold tracking-tight sm:text-5xl">{getTime(localZone, now, use24Hour)}</div>
          <p className="mt-1 text-xs opacity-90 sm:text-sm">
            {getDate(localZone, now)} · {getOffset(localZone, now)}
          </p>
        </div>

        <div
          className="hidden shrink-0 items-center gap-2 rounded-xl border p-3 sm:flex"
          style={{
            backgroundColor: 'rgba(255,255,255,0.12)',
            borderColor: 'rgba(255,255,255,0.2)',
          }}
        >
          {localNight ? <Moon size={24} /> : <Sun size={24} />}
          <span className="text-sm font-semibold">{localNight ? 'Nighttime' : 'Daytime'}</span>
        </div>
      </section>

      <section
        className="shrink-0 rounded-2xl border p-3 sm:p-4"
        style={{
          backgroundColor: 'var(--color-card)',
          borderColor: 'var(--color-border)',
          boxShadow: '0 2px 5px rgba(0,0,0,0.035)',
        }}
      >
        <div className="flex flex-col gap-2 sm:flex-row">
          <label
            className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-xl border px-3"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <Search size={17} style={{ color: 'var(--color-muted)' }} />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search country or city..."
              className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none"
              style={{ color: 'var(--color-text)' }}
            />
            {search && (
              <button type="button" onClick={() => setSearch('')} aria-label="Clear search">
                <X size={15} style={{ color: 'var(--color-muted)' }} />
              </button>
            )}
          </label>

          <div className="relative">
            <button
              type="button"
              onClick={() => setCountryMenuOpen((value) => !value)}
              className="inline-flex h-10 w-full items-center justify-between gap-2 rounded-xl border px-3 text-sm font-medium sm:w-52"
              style={{
                backgroundColor: 'var(--color-card)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
            >
              <span className="flex min-w-0 items-center gap-2 truncate">
                <Globe2 size={16} />
                <span className="truncate">{selected.country}</span>
              </span>
              <ChevronDown size={15} />
            </button>

            {countryMenuOpen && (
              <div
                className="absolute right-0 top-12 z-40 max-h-64 w-full overflow-y-auto rounded-xl border p-1.5 shadow-lg sm:w-60"
                style={{
                  backgroundColor: 'var(--color-card)',
                  borderColor: 'var(--color-border)',
                }}
              >
                {COUNTRY_ZONES.map((country) => (
                  <button
                    type="button"
                    key={country.country}
                    onClick={() => {
                      setSelectedCountry(country.country)
                      setSearch('')
                      setCountryMenuOpen(false)
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm"
                    style={{
                      backgroundColor: selectedCountry === country.country ? 'var(--color-soft)' : 'transparent',
                      color: 'var(--color-text)',
                    }}
                  >
                    <span>{country.flag}</span>
                    <span className="flex-1">{country.country}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="shrink-0 pb-2">
        <div className="mb-3 flex min-w-0 items-center gap-3 px-1">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl"
            style={{
              backgroundColor: 'var(--color-soft)',
            }}
          >
            {activeFlag || <Globe2 size={22} style={{ color: 'var(--color-primary)' }} />}
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-2xl font-bold sm:text-3xl">{activeCountry}</h2>
            <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
              {cards.length} {cards.length === 1 ? 'city' : 'cities'} · Live local time
            </p>
          </div>
        </div>

        {cards.length ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {cards.map((item) => {
              const hour = getHour(item.zone, now)
              const night = hour < 6 || hour >= 18

              return (
                <article
                  key={`${item.country}-${item.zone}`}
                  className="min-w-0 rounded-2xl border p-4 transition-colors"
                  style={{
                    backgroundColor: 'var(--color-card)',
                    borderColor: 'var(--color-border)',
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                        style={{
                          backgroundColor: 'var(--color-soft)',
                          color: 'var(--color-primary)',
                        }}
                      >
                        {night ? <Moon size={17} /> : <Sun size={17} />}
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate text-base font-semibold">{item.city}</h3>
                        <p className="truncate text-xs" style={{ color: 'var(--color-muted)' }}>
                          {item.country}
                        </p>
                      </div>
                    </div>
                    <span
                      className="shrink-0 rounded-lg px-2 py-1 text-xs font-medium"
                      style={{
                        backgroundColor: 'var(--color-soft)',
                        color: 'var(--color-primaryDark)',
                      }}
                    >
                      {getOffset(item.zone, now)}
                    </span>
                  </div>

                  <p className="mt-4 whitespace-nowrap text-2xl font-bold tracking-tight sm:text-3xl">{getTime(item.zone, now, use24Hour)}</p>
                  <p className="mt-1 text-sm" style={{ color: 'var(--color-muted)' }}>
                    {getDate(item.zone, now)}
                  </p>
                  <div
                    className="mt-3 flex items-center gap-1.5 border-t pt-2 text-xs"
                    style={{
                      borderColor: 'var(--color-borderSoft)',
                      color: 'var(--color-muted)',
                    }}
                  >
                    <Clock3 size={13} />
                    {night ? 'Nighttime' : 'Daytime'}
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div
            className="rounded-2xl border p-8 text-center"
            style={{
              backgroundColor: 'var(--color-card)',
              borderColor: 'var(--color-border)',
            }}
          >
            <Globe2 size={28} className="mx-auto" style={{ color: 'var(--color-muted)' }} />
            <p className="mt-3 text-sm font-semibold">No country or city found</p>
            <p className="mt-1 text-xs" style={{ color: 'var(--color-muted)' }}>
              Try another country or city name.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}

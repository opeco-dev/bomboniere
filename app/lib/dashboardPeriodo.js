export function getPeriodoDate(periodo) {
  const now = new Date();

  switch (periodo) {
    case "today":
      return new Date(now.setHours(0, 0, 0, 0));

    case "7d":
      return new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    case "30d":
      return new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    case "6m":
      return new Date(Date.now() - 180 * 24 * 60 * 60 * 1000);

    case "12m":
      return new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);

    default:
      return null;
  }
}

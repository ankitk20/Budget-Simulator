from utils.country_mapping import COUNTRY_MAPPING
from babel.numbers import format_currency

async def format_large_currency(value, country):
    abs_value = abs(value)
    suffix = ""

    if abs_value >= 1_000_000_000:  # Billions
        abs_value = round(abs / 1_000_000_000, 2)
        suffix = "B"
    elif abs_value >= 1_000_000:  # Millions
        abs_value = round(abs_value / 1_000_000, 2)
        suffix = "M"
    elif abs_value >= 1_000:  # Thousands
        abs_value = round(abs_value / 1_000, 2)
        suffix = "K"

    # **Ensure no decimals by converting to an integer before formatting**
    formatted = format_currency(abs_value, COUNTRY_MAPPING[country]["currency"], locale=COUNTRY_MAPPING[country]["locale"].replace("-", "_"), decimal_quantization=False)

    return f"{formatted}{suffix}"

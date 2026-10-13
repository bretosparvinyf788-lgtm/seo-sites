export const currencies=['USD','EUR','GBP','CNY','JPY','KRW','AUD','CAD','CHF','SEK','NOK','DKK','PLN','CZK','HUF','RON','TRY','RUB','UAH','AED','SAR','ILS','HKD','SGD'] as const;
export type Currency=typeof currencies[number];
export type ExchangeRates={date:string;rates:Record<string,number>;snapshot?:boolean};
export const isCurrency=(v:string):v is Currency=>currencies.includes(v as Currency);

import json,pathlib,subprocess,datetime
url='https://api.frankfurter.dev/v2/rates?base=USD&quotes=EUR,GBP,CAD,AUD,CNY,PLN,SEK'
data=json.loads(subprocess.check_output(['curl','-fsL','--max-time','20',url]));rates={'USD':1};dates={}
for row in data:
 assert row['base']=='USD' and row['rate']>0
 rates[row['quote']]=row['rate'];dates[row['quote']]=row['date']
assert len(rates)==8
out={'source':'Frankfurter','endpoint':url,'rates':rates,'dates':dates,'retrieved_at':datetime.datetime.now(datetime.timezone.utc).isoformat()}
(pathlib.Path(__file__).parent/'public/fx-rates.json').write_text(json.dumps(out))
print('Saved reference exchange rates:',dates)

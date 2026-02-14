import pandas as pd
import json
from sqlalchemy import create_engine

# 1. Connecti m3a MySQL (Beddel l-password dyalk)
engine = create_engine('mysql+mysqlconnector://root:a98UT7HFe2*@localhost/reservcut')

# 2. Qra l-fichié li nqiti (ready_for_mysql.csv)
df = pd.read_csv('data/ready2_for_mysql.csv')

# 3. Mapping: Beddel smiyat d l-columns bach y-jiw m3a MySQL
df = df.rename(columns={
    'title': 'name',
    'imageUrl': 'image_url'
})

# 4. Jme3 l-Opening Hours f JSON wahed
def format_opening_hours(row):
    hours_list = []
    for i in range(7):
        day_col = f'openingHours/{i}/day'
        hour_col = f'openingHours/{i}/hours'
        if pd.notna(row.get(day_col)) and row.get(day_col) != '':
            hours_list.append({
                "day": row[day_col],
                "hours": row[hour_col]
            })
    return json.dumps(hours_list)

df['opening_hours'] = df.apply(format_opening_hours, axis=1)

# 5. Zid l-columns li khassin (owner_id darori hit NO NULL)
# Hna drna 1 k default, t-qder t-beddelha b ID dyal ay user 3ndek f table users
df['owner_id'] = 1 
df['is_active'] = 1

# 6. Khtar ghir l-columns li andek f MySQL
mysql_columns = ['owner_id', 'name', 'address', 'city', 'phone', 'opening_hours', 'image_url', 'is_active']
df_to_sync = df[mysql_columns]

# 7. Upload l-data
try:
    df_to_sync.to_sql('salons', con=engine, if_exists='append', index=False)
    print("Mzyan! Ga3 l-salonat t-zadow l MySQL m-gadine.")
except Exception as e:
    print(f"Error: {e}")
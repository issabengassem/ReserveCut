import pandas as pd
import mysql.connector
import json

# 1. الاتصال بقاعدة البيانات MySQL
try:
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="a98UT7HFe2*", 
        database="reservcut",
        charset='utf8mb4' # لضمان إدخال الحروف العربية والفرنسية بشكل صحيح
    )
    cursor = conn.cursor()

    # 2. قراءة ملف combined_data.csv مع تحديد الترميز (Encoding)
    # استعملنا utf-8-sig لحل مشكل الحروف المخربقة
    df = pd.read_csv('combined_data.csv', encoding='utf-8-sig')

    # 3. تنظيف البيانات (Data Cleaning)
    # حذف الصفوف التي ليس لها عنوان (address) أو مدينة (city) أو اسم (title)
    # لأن جدولك في MySQL لا يقبل قيم NULL في هذه الأعمدة
    df = df.dropna(subset=['address', 'title', 'city'])

    # تعويض باقي القيم الفارغة (NaN) بـ None ليتم إدخالها كـ NULL في MySQL
    df = df.where(pd.notnull(df), None)

    # 4. دالة لتجميع ساعات العمل في صيغة JSON
    def get_opening_hours(row):
        hours_dict = {}
        for i in range(7):
            day_key = f'openingHours/{i}/day'
            hour_key = f'openingHours/{i}/hours'
            # نتحقق أن اليوم والساعة موجودان وليسا فارغين
            if row.get(day_key) is not None:
                hours_dict[row[day_key]] = row[hour_key]
        return json.dumps(hours_dict, ensure_ascii=False)

    # 5. استعلام الإدخال (SQL Query)
    # استعملنا id=2 كـ owner_id لأنه أول مستخدم موجود في جدولك
    sql = """
    INSERT INTO salons (owner_id, name, address, city, phone, opening_hours, image_url)
    VALUES (%s, %s, %s, %s, %s, %s, %s)
    """

    # 6. دورة الإدخال (Loop)
    print(f"بدأنا عملية الإدخال لـ {len(df)} صالون...")
    counter = 0
    for _, row in df.iterrows():
        hours_json = get_opening_hours(row)
        
        values = (
            2,             # owner_id (Salon Manager)
            row['title'],  # name
            row['address'],# address
            row['city'],   # city
            row['phone'],  # phone (مسموح أن يكون NULL)
            hours_json,    # opening_hours (JSON)
            row['imageUrl']# image_url (العمود الجديد الذي أضفته)
        )
        
        cursor.execute(sql, values)
        counter += 1

    # حفظ التغييرات
    conn.commit()
    print(f"مبروك! تم إدخال {counter} صالون بنجاح لجدول salons.")

except mysql.connector.Error as err:
    print(f"خطأ في قاعدة البيانات: {err}")
except FileNotFoundError:
    print("خطأ: لم يتم العثور على ملف combined_data.csv في هذا المجلد.")
finally:
    if 'conn' in locals() and conn.is_connected():
        cursor.close()
        conn.close()
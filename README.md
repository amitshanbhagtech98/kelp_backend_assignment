 
---

## 🚀 CSV to JSON Converter API  

### 📌 Table of Contents  
- [About the Project](#about-the-project)  
- [Features](#features)
- [Database Schema](#database-schema)  
- [Age Distribution Report](#age-distribution-report)  
- [Assumptions](#assumptions)
---

## 📖 About the Project  
This project is a **CSV to JSON Converter API** built using **Node.js** (Express.js/NestJS) that:  
✅ Converts CSV files into JSON objects  
✅ Stores data in a **PostgreSQL** database  
✅ Supports deeply nested properties  
✅ Computes **age distribution** statistics  

---

## ✨ Features  
- Converts **CSV** data into **JSON** format  
- Supports **infinite-depth properties** (e.g., `a.b.c`)  
- Stores structured data in a **PostgreSQL** database  
- Computes **age distribution** of all records  
- Handles **large files** efficiently (50,000+ records)  

---

## 🗄 Database Schema  
```sql
CREATE TABLE public.users ( 
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL, -- Concatenated firstName + lastName
  age INT NOT NULL,
  address JSONB NULL,
  additional_info JSONB NULL
);
```

---

## 📊 Age Distribution Report  

| Age Group | Percentage |
|-----------|-----------|
| < 20      | 20%       |
| 20 - 40   | 45%       |
| 40 - 60   | 25%       |
| > 60      | 10%       |

---

## 🔍 Assumptions  
- The first row in the CSV file **always** contains headers  
- CSV files **may contain deeply nested properties**  
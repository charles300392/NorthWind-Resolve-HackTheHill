from backend.app.data.loader import data_file_exists, load_csv


filename = "northwind_complaints.csv"

print("File exists:", data_file_exists(filename))

if data_file_exists(filename):
    df = load_csv(filename)

    print("Rows:", len(df))
    print("Columns:", list(df.columns))
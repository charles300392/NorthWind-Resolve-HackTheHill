from .data_loader import load_all_data


def main():

    datasets = load_all_data()

    print("\n========================================")
    print("NORTHWIND DATA VALIDATION")
    print("========================================\n")

    for name, df in datasets.items():

        print(f"DATASET: {name}")
        print(f"Rows: {len(df)}")
        print(f"Columns: {len(df.columns)}")

        print("\nColumns:")

        for column in df.columns:
            print(f"  - {column}")

        print("\nMissing values:")

        missing = df.isna().sum()

        for column, count in missing.items():

            if count > 0:
                print(
                    f"  - {column}: {count}"
                )

        print("\n")


if __name__ == "__main__":
    main()
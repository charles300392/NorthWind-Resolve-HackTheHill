import json

from data.analysis import run_full_analysis


def main():
    analysis = run_full_analysis()

    print("\n========================================")
    print("NORTHWIND LOCAL DATA ANALYSIS")
    print("========================================\n")

    print("=== OVERALL ===")
    print(
        json.dumps(
            analysis["overall"],
            indent=2,
        )
    )

    print("\n=== BY REGION ===")
    print(
        json.dumps(
            analysis["by_region"],
            indent=2,
        )
    )

    print("\n=== BY CATEGORY ===")
    print(
        json.dumps(
            analysis["by_category"],
            indent=2,
        )
    )

    print("\n=== BY PRIORITY ===")
    print(
        json.dumps(
            analysis["by_priority"],
            indent=2,
        )
    )

    print("\n=== BY CHANNEL ===")
    print(
        json.dumps(
            analysis["by_channel"],
            indent=2,
        )
    )

    print("\n=== BY SOURCE SYSTEM ===")
    print(
        json.dumps(
            analysis["by_source_system"],
            indent=2,
        )
    )

    print("\n=== MONTHLY ===")
    print(
        json.dumps(
            analysis["monthly"],
            indent=2,
        )
    )

    print("\n=== METER READS ===")
    print(
        json.dumps(
            analysis["meter_reads"],
            indent=2,
        )
    )

    print("\n=== STAFFING ===")
    print(
        json.dumps(
            analysis["staffing"],
            indent=2,
        )
    )

    print("\n=== AI PILOT ===")
    print(
        json.dumps(
            analysis["ai_pilot"],
            indent=2,
        )
    )

    print("\n=== UNIT COSTS ===")
    print(
        json.dumps(
            analysis["unit_costs"],
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
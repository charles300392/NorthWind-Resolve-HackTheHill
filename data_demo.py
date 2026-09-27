import json

from data.context_builder import build_context


COMPLAINT_ID = "NW-100001"


def main():

    context = build_context(
        COMPLAINT_ID
    )

    print("\n========================================")
    print("NORTHWIND CONTEXT BUILDER")
    print("========================================\n")

    print(
        json.dumps(
            context,
            indent=2,
            default=str,
        )
    )


if __name__ == "__main__":
    main()
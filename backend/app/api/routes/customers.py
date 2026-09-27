from fastapi import APIRouter, Query

from backend.app.data.loader import load_csv


router = APIRouter(
    prefix="/customers",
    tags=["Customers"],
)


@router.get("")
def list_customers(
    limit: int = Query(
        default=100,
        ge=1,
        le=500,
    ),
    offset: int = Query(
        default=0,
        ge=0,
    ),
    search: str = Query(
        default="",
    ),
):

    df = load_csv(
        "northwind_complaints.csv",
    )


    grouped = (
        df.groupby("account_id")
        .agg(
            complaints=(
                "complaint_id",
                "count",
            ),

            open_cases=(
                "status",
                lambda values:
                int(
                    (
                        values
                        .astype(str)
                        .str.lower()
                        != "closed"
                    ).sum()
                ),
            ),

            breached_cases=(
                "sla_breach",
                "sum",
            ),

            reopened_cases=(
                "reopened",
                "sum",
            ),

            transfer_count=(
                "transferred_between_systems",
                "sum",
            ),

            latest_complaint_date=(
                "date_opened",
                "max",
            ),
        )
        .reset_index()
    )


    grouped[
        "breached_cases"
    ] = grouped[
        "breached_cases"
    ].astype(int)


    grouped[
        "reopened_cases"
    ] = grouped[
        "reopened_cases"
    ].astype(int)


    grouped[
        "transfer_count"
    ] = grouped[
        "transfer_count"
    ].astype(int)


    if search.strip():

        grouped = grouped[
            grouped[
                "account_id"
            ]
            .astype(str)
            .str.contains(
                search.strip(),
                case=False,
                na=False,
            )
        ]


    grouped = grouped.sort_values(
        "account_id",
    )


    total = len(
        grouped,
    )


    page = grouped.iloc[
        offset:
        offset + limit
    ]


    records = []

    for row in page.to_dict(
        orient="records",
    ):

        latest = (
            None
            if row[
                "latest_complaint_date"
            ] is None
            else str(
                row[
                    "latest_complaint_date"
                ],
            )
        )


        records.append(
            {
                "account_id":
                    str(
                        row[
                            "account_id"
                        ],
                    ),

                "complaints":
                    int(
                        row[
                            "complaints"
                        ],
                    ),

                "open_cases":
                    int(
                        row[
                            "open_cases"
                        ],
                    ),

                "breached_cases":
                    int(
                        row[
                            "breached_cases"
                        ],
                    ),

                "reopened_cases":
                    int(
                        row[
                            "reopened_cases"
                        ],
                    ),

                "transfer_count":
                    int(
                        row[
                            "transfer_count"
                        ],
                    ),

                "latest_complaint_date":
                    latest,
            },
        )


    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "count": len(records),
        "items": records,
    }
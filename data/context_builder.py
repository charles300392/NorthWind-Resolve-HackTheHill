from __future__ import annotations

from typing import Any

import pandas as pd

from .data_loader import load_all_data


def _clean_value(value: Any):

    if pd.isna(value):
        return None

    if isinstance(value, float):
        return round(value, 4)

    return value


class NorthwindContextBuilder:

    def __init__(
        self,
        datasets: dict[str, pd.DataFrame],
    ):

        self.complaints = datasets["complaints"].copy()
        self.meter_reads = datasets["meter_reads"].copy()
        self.staffing = datasets["staffing"].copy()
        self.monthly_kpis = datasets["monthly_kpis"].copy()
        self.systems = datasets["systems"].copy()
        self.ai_pilot = datasets["ai_pilot"].copy()
        self.unit_costs = datasets["unit_costs"].copy()

        self.complaints["date_opened"] = pd.to_datetime(
            self.complaints["date_opened"],
            errors="coerce",
        )

        self.complaints["date_closed"] = pd.to_datetime(
            self.complaints["date_closed"],
            errors="coerce",
        )

        self.complaints["month"] = (
            self.complaints["date_opened"]
            .dt.to_period("M")
            .astype(str)
        )

    # ---------------------------------------------------------
    # METER READS
    # ---------------------------------------------------------

    def get_meter_context(
        self,
        region: str,
        month: str,
    ) -> dict:

        df = self.meter_reads[
            (self.meter_reads["region"] == region)
            & (self.meter_reads["month"] == month)
        ]

        if df.empty:

            return {
                "estimated_read_rate": None,
                "smart_meter_penetration": None,
                "billing_exception_rate": None,
                "billing_exceptions_raised": None,
                "accounts": None,
                "systems_serving_region": None,
            }

        row = df.iloc[0]

        accounts = float(
            row["accounts"]
        )

        billing_exceptions = float(
            row["billing_exceptions_raised"]
        )

        billing_exception_rate = (
            billing_exceptions / accounts
            if accounts > 0
            else 0.0
        )

        return {
            "estimated_read_rate": _clean_value(
                row["estimated_read_rate"]
            ),

            "smart_meter_penetration": _clean_value(
                row["smart_meter_penetration"]
            ),

            "billing_exception_rate": round(
                billing_exception_rate,
                4,
            ),

            "billing_exceptions_raised": int(
                billing_exceptions
            ),

            "accounts": int(
                accounts
            ),

            "systems_serving_region": row[
                "systems_serving_region"
            ],
        }

    # ---------------------------------------------------------
    # STAFFING
    # ---------------------------------------------------------

    def get_staffing_context(
        self,
        region: str,
        month: str,
    ) -> dict:

        df = self.staffing[
            (self.staffing["region"] == region)
            & (self.staffing["month"] == month)
        ]

        if df.empty:

            return {
                "agent_fte": None,
                "open_vacancies": None,
                "attrition_rate_12m": None,
                "complaints_opened_per_agent": None,
            }

        row = df.iloc[0]

        return {
            "agent_fte": int(
                row["agent_fte"]
            ),

            "open_vacancies": int(
                row["open_vacancies"]
            ),

            "attrition_rate_12m": _clean_value(
                row["attrition_rate_12m"]
            ),

            "complaints_opened_per_agent": _clean_value(
                row["complaints_opened_per_agent"]
            ),
        }

    # ---------------------------------------------------------
    # MONTHLY KPI
    # ---------------------------------------------------------

    def get_monthly_kpis(
        self,
        month: str,
    ) -> dict:

        df = self.monthly_kpis[
            self.monthly_kpis["month"] == month
        ]

        if df.empty:

            return {
                "complaints_opened": None,
                "complaints_closed": None,
                "avg_days_to_close": None,
                "first_contact_resolution_rate": None,
                "inbound_calls": None,
                "cost_to_serve_per_account": None,
                "regulator_satisfaction_score_of_5": None,
            }

        row = df.iloc[0]

        return {
            "complaints_opened": int(
                row["complaints_opened"]
            ),

            "complaints_closed": int(
                row["complaints_closed"]
            ),

            "avg_days_to_close": _clean_value(
                row["avg_days_to_close"]
            ),

            "first_contact_resolution_rate": _clean_value(
                row["first_contact_resolution_rate"]
            ),

            "inbound_calls": int(
                row["inbound_calls"]
            ),

            "cost_to_serve_per_account": _clean_value(
                row["cost_to_serve_per_account"]
            ),

            "regulator_satisfaction_score_of_5": _clean_value(
                row["regulator_satisfaction_score_of_5"]
            ),
        }

    # ---------------------------------------------------------
    # SYSTEM
    # ---------------------------------------------------------

    def get_system_context(
        self,
        source_system: str | None,
    ) -> dict:

        if not source_system:

            return {}

        df = self.systems[
            self.systems["system_id"]
            == source_system
        ]

        if df.empty:

            return {}

        row = df.iloc[0]

        return {
            "system_id": row["system_id"],
            "system_name": row["system_name"],
            "purpose": row["purpose"],
            "year_installed": int(
                row["year_installed"]
            ),
            "vendor": row["vendor"],
            "tech_stack": row["tech_stack"],
            "integration_method": row[
                "integration_method"
            ],
            "annual_run_cost": float(
                row["annual_run_cost"]
            ),
            "owning_function": row[
                "owning_function"
            ],
        }

    # ---------------------------------------------------------
    # HISTORICAL COMPLAINT METRICS
    # ---------------------------------------------------------

    def get_complaint_history(
        self,
        region: str,
        month: str,
    ) -> dict:

        df = self.complaints[
            (
                self.complaints["region"]
                == region
            )
            & (
                self.complaints["month"]
                <= month
            )
        ]

        if df.empty:

            return {
                "complaints_count": 0,
                "historical_breach_rate": 0.0,
                "transfer_rate": 0.0,
                "reopen_rate": 0.0,
                "average_days_to_close": 0.0,
            }

        return {
            "complaints_count": int(
                len(df)
            ),

            "historical_breach_rate": round(
                float(
                    df["sla_breach"].mean()
                ),
                4,
            ),

            "transfer_rate": round(
                float(
                    df[
                        "transferred_between_systems"
                    ].mean()
                ),
                4,
            ),

            "reopen_rate": round(
                float(
                    df["reopened"].mean()
                ),
                4,
            ),

            "average_days_to_close": round(
                float(
                    df["days_to_close"].mean()
                ),
                2,
            ),
        }

    # ---------------------------------------------------------
    # CUSTOMER HISTORY
    # ---------------------------------------------------------

    def get_customer_history(
        self,
        account_id: str | None,
    ) -> dict:

        if not account_id:

            return {
                "previous_complaints": 0,
                "previous_breaches": 0,
                "previous_transfers": 0,
                "previous_reopens": 0,
            }

        df = self.complaints[
            self.complaints["account_id"]
            == account_id
        ]

        return {
            "previous_complaints": int(
                len(df)
            ),

            "previous_breaches": int(
                df["sla_breach"].sum()
            ),

            "previous_transfers": int(
                df[
                    "transferred_between_systems"
                ].sum()
            ),

            "previous_reopens": int(
                df["reopened"].sum()
            ),
        }

    # ---------------------------------------------------------
    # AI PILOT
    # ---------------------------------------------------------

    def get_ai_pilot_context(
        self,
        month: str,
    ) -> dict:

        df = self.ai_pilot[
            self.ai_pilot["month"] <= month
        ]

        if df.empty:

            return {}

        row = df.iloc[-1]

        return {
            "assistant_sessions": int(
                row["assistant_sessions"]
            ),

            "fully_contained_rate": _clean_value(
                row["fully_contained_rate"]
            ),

            "escalated_to_agent_rate": _clean_value(
                row["escalated_to_agent_rate"]
            ),

            "abandoned_rate": _clean_value(
                row["abandoned_rate"]
            ),

            "repeat_contact_within_7_days_rate": _clean_value(
                row[
                    "repeat_contact_within_7_days_rate"
                ]
            ),

            "assistant_csat_of_5": _clean_value(
                row["assistant_csat_of_5"]
            ),

            "complaint_raised_after_session_rate": _clean_value(
                row[
                    "complaint_raised_after_session_rate"
                ]
            ),
        }

    # ---------------------------------------------------------
    # UNIT COSTS
    # ---------------------------------------------------------

    def get_unit_costs(self) -> dict:

        result = {}

        for _, row in self.unit_costs.iterrows():

            item = str(
                row["item"]
            )

            result[item] = {
                "unit_cost": float(
                    row["unit_cost"]
                ),
                "unit": row["unit"],
            }

        return result

    # ---------------------------------------------------------
    # COMPLETE CONTEXT
    # ---------------------------------------------------------

    def build_context(
        self,
        complaint_id: str,
    ) -> dict:

        matches = self.complaints[
            self.complaints["complaint_id"]
            == complaint_id
        ]

        if matches.empty:

            raise ValueError(
                f"Complaint not found: {complaint_id}"
            )

        complaint = matches.iloc[0]

        region = complaint["region"]
        month = complaint["month"]

        account_id = complaint[
            "account_id"
        ]

        source_system = complaint[
            "source_system"
        ]

        meter = self.get_meter_context(
            region=region,
            month=month,
        )

        staffing = self.get_staffing_context(
            region=region,
            month=month,
        )

        kpis = self.get_monthly_kpis(
            month=month,
        )

        history = self.get_complaint_history(
            region=region,
            month=month,
        )

        customer = self.get_customer_history(
            account_id=account_id,
        )

        system = self.get_system_context(
            source_system=source_system,
        )

        pilot = self.get_ai_pilot_context(
            month=month,
        )

        return {
            "complaint": {
                "complaint_id": complaint[
                    "complaint_id"
                ],

                "date_opened": str(
                    complaint["date_opened"].date()
                ),

                "status": complaint[
                    "status"
                ],

                "channel": complaint[
                    "channel"
                ],

                "category": complaint[
                    "category"
                ],

                "priority": complaint[
                    "priority"
                ],

                "region": region,

                "source_system": source_system,

                "transferred_between_systems": int(
                    complaint[
                        "transferred_between_systems"
                    ]
                ),

                "sla_days": int(
                    complaint["sla_days"]
                ),

                "days_to_close": _clean_value(
                    complaint["days_to_close"]
                ),

                "sla_breach": int(
                    complaint["sla_breach"]
                ),

                "reopened": int(
                    complaint["reopened"]
                ),

                "resolution_action": complaint[
                    "resolution_action"
                ],

                "resolvable_by_information_only": _clean_value(
                    complaint[
                        "resolvable_by_information_only"
                    ]
                ),

                "bill_correction_value": _clean_value(
                    complaint[
                        "bill_correction_value"
                    ]
                ),
            },

            "region": region,

            "month": month,

            "historical_breach_rate": history[
                "historical_breach_rate"
            ],

            "estimated_read_rate": meter[
                "estimated_read_rate"
            ],

            "smart_meter_penetration": meter[
                "smart_meter_penetration"
            ],

            "billing_exception_rate": meter[
                "billing_exception_rate"
            ],

            "billing_exceptions_raised": meter[
                "billing_exceptions_raised"
            ],

            "transfer_history": (
                history["transfer_rate"] > 0
            ),

            "transfer_rate": history[
                "transfer_rate"
            ],

            "reopen_rate": history[
                "reopen_rate"
            ],

            "average_days_to_close": history[
                "average_days_to_close"
            ],

            "customer_history": customer,

            "staffing": staffing,

            "monthly_kpis": kpis,

            "source_system_context": system,

            "previous_ai_pilot": pilot,

            "unit_costs": self.get_unit_costs(),
        }


def build_context(
    complaint_id: str,
) -> dict:

    datasets = load_all_data()

    builder = NorthwindContextBuilder(
        datasets
    )

    return builder.build_context(
        complaint_id
    )
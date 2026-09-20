import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.models.schemas import DeviceAnalysis, ConditionAnswers
from app.services.recommendation_engine import evaluate_recommendation

def test_swollen_battery_safety_alert():
    device = DeviceAnalysis(
        device_type="smartphone",
        category="mobile electronics",
        brand="Apple",
        model="iPhone X",
        visible_condition="severely damaged",
        visible_damage=["swollen back glass", "bulging battery"],
        confidence=0.95
    )
    answers = ConditionAnswers(
        turns_on="no",
        battery_hazard="yes",
        approximate_age="more_than_5_years",
        main_problem="battery_issue"
    )
    res = evaluate_recommendation(device, answers)
    assert res.recommendation == "SAFETY_ALERT", f"Expected SAFETY_ALERT, got {res.recommendation}"
    assert len(res.safety_warnings) > 0
    print("[PASS] test_swollen_battery_safety_alert passed")

def test_working_recent_device_reuse():
    device = DeviceAnalysis(
        device_type="smartphone",
        category="mobile electronics",
        brand="Samsung",
        model="Galaxy S22",
        visible_condition="good",
        visible_damage=[],
        confidence=0.92
    )
    answers = ConditionAnswers(
        turns_on="yes",
        battery_hazard="no",
        approximate_age="1_to_3_years",
        main_problem="no_problem"
    )
    res = evaluate_recommendation(device, answers)
    assert res.recommendation == "REUSE", f"Expected REUSE, got {res.recommendation}"
    print("[PASS] test_working_recent_device_reuse passed")

def test_working_older_device_donate():
    device = DeviceAnalysis(
        device_type="laptop",
        category="computing",
        brand="Lenovo",
        model="ThinkPad",
        visible_condition="fair",
        visible_damage=["minor scratch"],
        confidence=0.89
    )
    answers = ConditionAnswers(
        turns_on="yes",
        battery_hazard="no",
        approximate_age="3_to_5_years",
        main_problem="minor_issue"
    )
    res = evaluate_recommendation(device, answers)
    assert res.recommendation == "DONATE", f"Expected DONATE, got {res.recommendation}"
    print("[PASS] test_working_older_device_donate passed")

def test_repairable_damage_repair():
    device = DeviceAnalysis(
        device_type="laptop",
        category="computing",
        brand="Dell",
        model="XPS 13",
        visible_condition="damaged",
        visible_damage=["cracked screen panel"],
        confidence=0.90
    )
    answers = ConditionAnswers(
        turns_on="yes",
        battery_hazard="no",
        approximate_age="1_to_3_years",
        main_problem="physical_damage"
    )
    res = evaluate_recommendation(device, answers)
    assert res.recommendation == "REPAIR", f"Expected REPAIR, got {res.recommendation}"
    print("[PASS] test_repairable_damage_repair passed")

def test_obsolete_broken_recycle():
    device = DeviceAnalysis(
        device_type="monitor",
        category="peripherals",
        brand="ViewSonic",
        model="Old CRT",
        visible_condition="damaged",
        visible_damage=["shattered housing"],
        confidence=0.85
    )
    answers = ConditionAnswers(
        turns_on="no",
        battery_hazard="no",
        approximate_age="more_than_5_years",
        main_problem="completely_non_functional"
    )
    res = evaluate_recommendation(device, answers)
    assert res.recommendation == "RECYCLE", f"Expected RECYCLE, got {res.recommendation}"
    print("[PASS] test_obsolete_broken_recycle passed")

if __name__ == "__main__":
    test_swollen_battery_safety_alert()
    test_working_recent_device_reuse()
    test_working_older_device_donate()
    test_repairable_damage_repair()
    test_obsolete_broken_recycle()
    print("All recommendation engine tests passed!")

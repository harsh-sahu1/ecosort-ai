from typing import List, Optional, Literal
from pydantic import BaseModel, Field

class DeviceAnalysis(BaseModel):
    device_type: str = Field(..., description="e.g. smartphone, laptop, tablet, monitor, charger, headphones, etc.")
    category: str = Field(..., description="e.g. mobile electronics, computing, audio, peripherals, power & accessories")
    brand: Optional[str] = Field("Unknown", description="Detected brand or Unknown")
    model: Optional[str] = Field("Not identifiable", description="Detected model or Not identifiable")
    visible_condition: str = Field(..., description="e.g. pristine, good, fair, worn, damaged, severely damaged")
    visible_damage: List[str] = Field(default_factory=list, description="List of visible issues such as cracked screen, dented casing, fraying wire, etc.")
    confidence: float = Field(0.85, ge=0.0, le=1.0, description="Confidence score between 0.0 and 1.0")

class ConditionAnswers(BaseModel):
    turns_on: Literal["yes", "no", "not_sure"]
    battery_hazard: Literal["yes", "no", "not_sure", "not_applicable"]
    approximate_age: Literal["less_than_1_year", "1_to_3_years", "3_to_5_years", "more_than_5_years", "not_sure"]
    main_problem: Literal["no_problem", "minor_issue", "major_issue", "completely_non_functional", "physical_damage", "battery_issue", "not_sure"]

class RecommendationRequest(BaseModel):
    device: DeviceAnalysis
    condition_answers: ConditionAnswers

class EnvironmentalImpact(BaseModel):
    title: str
    headline_metric: str
    materials_salvageable: List[str]
    co2_avoided_kg: Optional[float] = None
    landfill_hazard_prevented: str
    qualitative_impact: str

class RecommendationResponse(BaseModel):
    recommendation: Literal["REPAIR", "REUSE", "DONATE", "RECYCLE", "SAFETY_ALERT"]
    recommendation_label: str
    confidence: Literal["High", "Medium", "Low"]
    summary: str
    why: str
    reasons: List[str]
    key_factors: List[str]
    action_steps: List[str]
    safety_warnings: List[str]
    environmental_impact: EnvironmentalImpact
    device_snapshot: DeviceAnalysis

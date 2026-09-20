from app.models.schemas import (
    DeviceAnalysis,
    ConditionAnswers,
    RecommendationResponse,
    EnvironmentalImpact,
)

def estimate_environmental_impact(device_type: str, recommendation: str) -> EnvironmentalImpact:
    d_lower = device_type.lower()
    
    # Heuristic data by category (realistic benchmarks labeled as estimated averages)
    if any(k in d_lower for k in ["laptop", "computer", "pc", "macbook"]):
        materials = ["Aluminum (up to 70%)", "Copper wiring", "Gold & Silver contacts", "Lithium-ion cells", "Rare earth magnets"]
        co2_val = 180.0 if recommendation in ["REUSE", "DONATE", "REPAIR"] else 45.0
        headline = "~180 kg CO₂ equivalent lifecycle mitigation" if recommendation in ["REUSE", "DONATE", "REPAIR"] else "~45 kg raw material extraction footprint reduced"
        landfill_hazard = "Contains lead solder, flame retardants, and mercury backlight traces"
    elif any(k in d_lower for k in ["phone", "smartphone", "iphone", "android", "galaxy"]):
        materials = ["Precious metals (Gold, Silver, Palladium)", "Cobalt & Lithium", "Optical glass", "Recyclable copper"]
        co2_val = 55.0 if recommendation in ["REUSE", "DONATE", "REPAIR"] else 15.0
        headline = "~55 kg CO₂ lifecycle impact prevented" if recommendation in ["REUSE", "DONATE", "REPAIR"] else "~15 kg virgin mineral extraction offset"
        landfill_hazard = "High cobalt & lithium toxicity if crushed in municipal municipal landfills"
    elif any(k in d_lower for k in ["tablet", "ipad"]):
        materials = ["Anodized aluminum casing", "Lithium polymer pack", "Indium tin oxide (screen)", "Copper busbars"]
        co2_val = 80.0 if recommendation in ["REUSE", "DONATE", "REPAIR"] else 22.0
        headline = "~80 kg CO₂ lifecycle savings" if recommendation in ["REUSE", "DONATE", "REPAIR"] else "~22 kg resource footprint offset"
        landfill_hazard = "Battery degradation poses leaching risks to ground soil"
    elif any(k in d_lower for k in ["monitor", "tv", "display", "screen"]):
        materials = ["High-purity optical glass", "Circuit copper", "Ferrous shielding", "Thermoplastics"]
        co2_val = 110.0 if recommendation in ["REUSE", "DONATE", "REPAIR"] else 30.0
        headline = "~110 kg CO₂ lifecycle preservation" if recommendation in ["REUSE", "DONATE", "REPAIR"] else "~30 kg glass and metals circularity"
        landfill_hazard = "Heavy metals, phosphor coatings, and brominated plastics"
    elif any(k in d_lower for k in ["battery", "power bank", "charger"]):
        materials = ["Nickel", "Cobalt", "Lithium carbonate", "Copper foil"]
        co2_val = 20.0
        headline = "Critical mineral closed-loop reclamation"
        landfill_hazard = "Extreme fire hazard & groundwater heavy metal contamination"
    else:
        materials = ["Mixed copper & brass", "Engineering plastics", "Silicon board chips"]
        co2_val = 25.0
        headline = "Conservation of refined metals and polymers"
        landfill_hazard = "Resistant microplastics and leaching circuitry"

    if recommendation in ["REUSE", "DONATE"]:
        qualitative = "Extending the usable lifespan of consumer electronics is the single most effective way to amortize their initial manufacturing and mining carbon footprint."
    elif recommendation == "REPAIR":
        qualitative = "Targeted component repair avoids over 80% of the emissions and resource depletion required to manufacture and ship a brand new replacement device."
    elif recommendation == "SAFETY_ALERT":
        qualitative = "Immediate specialized hazardous e-waste containment prevents thermal runway incidents, toxic vapor discharge, and landfill fires."
    else: # RECYCLE
        qualitative = "Controlled metallurgical smelting and urban mining recover up to 95% of strategic raw materials, preventing destructive virgin ore excavation."

    return EnvironmentalImpact(
        title="🌱 Why Responsible Action Matters",
        headline_metric=headline,
        materials_salvageable=materials,
        co2_avoided_kg=co2_val,
        landfill_hazard_prevented=landfill_hazard,
        qualitative_impact=qualitative,
    )


def evaluate_recommendation(device: DeviceAnalysis, answers: ConditionAnswers) -> RecommendationResponse:
    reasons = []
    key_factors = []
    safety_warnings = []
    action_steps = []

    # 1. CRITICAL SAFETY CHECK: Battery hazard
    is_battery_hazard = answers.battery_hazard == "yes"
    visible_battery_hazard = any(
        "swollen" in d.lower() or "bulg" in d.lower() or "leak" in d.lower() or "punctur" in d.lower()
        for d in device.visible_damage
    )

    if is_battery_hazard or visible_battery_hazard:
        recommendation = "SAFETY_ALERT"
        recommendation_label = "⚠️ SAFETY ALERT: HAZARDOUS BATTERY CONDITION"
        confidence = "High"

        safety_warnings.append("CRITICAL: Battery is reported or visibly swollen, punctured, or leaking.")
        safety_warnings.append("DO NOT attempt to charge, power on, puncture, or press the swollen casing.")
        safety_warnings.append("DO NOT attempt DIY battery removal if it is glued, punctured, or tightly encapsulated.")
        safety_warnings.append("Store the device in a non-combustible container (e.g. metal box, sand bucket, or dry cool area) away from flammable materials.")

        reasons.append("Swollen or compromised lithium-ion batteries present an immediate risk of thermal runaway, toxic off-gassing, and spontaneous ignition.")
        reasons.append("The device cannot be safely used, donated, or repaired by general consumers.")

        key_factors.append("Reported or visible battery swelling/damage")
        key_factors.append("Severe fire hazard classification")
        key_factors.append("Professional hazardous handling required")

        summary = "Immediate safety precautions required due to hazardous battery state. Must be routed to a certified specialized hazardous e-waste facility."
        why = f"Your {device.device_type} shows signs of a swollen or physically compromised battery. When lithium-ion pouch cells undergo internal gas buildup or electrolyte leakage, continued charging or operation can cause rapid combustion. Safety takes complete priority over repair or resale."

        action_steps = [
            "Immediately disconnect from all chargers and wall power outlets.",
            "Place the device in a cool, well-ventilated, non-flammable area (e.g., metal tin, stone surface, or bucket with sand/dirt).",
            "Do NOT pack it into regular household trash, curbside blue bins, or standard mail-in dropboxes.",
            "Contact your municipal hazardous waste (HHW) depot or a certified electronics recycler with dedicated damaged battery containment.",
            "Clearly notify the recycling staff upon drop-off that the unit contains a swollen or damaged lithium cell."
        ]

        impact = estimate_environmental_impact(device.device_type, recommendation)
        return RecommendationResponse(
            recommendation=recommendation,
            recommendation_label=recommendation_label,
            confidence=confidence,
            summary=summary,
            why=why,
            reasons=reasons,
            key_factors=key_factors,
            action_steps=action_steps,
            safety_warnings=safety_warnings,
            environmental_impact=impact,
            device_snapshot=device,
        )

    # 2. REUSE OR DONATE
    # Device powers on, no major damage, functional
    device_powers_on = answers.turns_on == "yes"
    no_major_issue = answers.main_problem in ["no_problem", "minor_issue"]
    is_not_severely_damaged = device.visible_condition.lower() not in ["severely damaged", "destroyed"]

    if device_powers_on and no_major_issue and is_not_severely_damaged:
        # Check age to decide between REUSE and DONATE
        if answers.approximate_age in ["less_than_1_year", "1_to_3_years"] and answers.main_problem == "no_problem":
            recommendation = "REUSE"
            recommendation_label = "🔄 RECOMMENDED: REUSE OR RESELL"
            confidence = "High"
            reasons.append(f"Your {device.device_type} is operational, relatively modern, and structurally sound.")
            reasons.append("Retaining, repurposing, or reselling modern electronics prevents unnecessary device production.")
            key_factors.append("Powers on normally")
            key_factors.append("Good physical condition")
            key_factors.append("Modern hardware with secondary life value")

            summary = f"Your {device.device_type} still holds substantial utility. Repurposing or reselling is the best eco-choice."
            why = f"Because your {device.device_type} turns on and has no critical operational flaws, it remains fully viable for daily use, secondary household tasks (e.g. dedicated media player, home hub, smart display), or peer-to-peer resale."

            action_steps = [
                "Back up all photos, files, and personal records to cloud or external storage.",
                "Sign out of Apple iCloud, Google, Microsoft, and all online accounts.",
                "Perform a full factory reset (Settings > Reset / Erase all content and settings).",
                "Remove physical SIM cards and micro-SD memory cards.",
                "Clean the exterior with 70% isopropyl alcohol wipes.",
                "Consider secondary uses (e.g. webcam, offline music player, security camera) or list on verified refurbished/marketplace platforms."
            ]
        else:
            recommendation = "DONATE"
            recommendation_label = "🎁 RECOMMENDED: DONATE"
            confidence = "High" if answers.approximate_age != "not_sure" else "Medium"
            reasons.append(f"The {device.device_type} turns on and works well enough to benefit someone in need.")
            reasons.append("Donation bridges the digital divide for students, non-profits, and community centers.")
            key_factors.append("Powers on reliably")
            key_factors.append("Suitable for education or basic productivity")
            key_factors.append("Safe battery condition")

            summary = f"Your {device.device_type} works and can provide meaningful utility to a student, charity, or community program."
            why = f"Your {device.device_type} functions and has no hazardous defects. Rather than collecting dust or undergoing energy-intensive smelting, donating it directly extends its active service life."

            action_steps = [
                "Back up any personal files and photos.",
                "Sign out of cloud accounts and disable device activation locks (Find My, Google FRP).",
                "Perform an irreversible factory reset.",
                "Eject any SD cards, SIM trays, or peripheral dongles.",
                "Gently clean exterior ports and casing.",
                "Bundle compatible power cords or adapters if you have them, and contact a local school, library, or verified non-profit donation drive."
            ]

        impact = estimate_environmental_impact(device.device_type, recommendation)
        return RecommendationResponse(
            recommendation=recommendation,
            recommendation_label=recommendation_label,
            confidence=confidence,
            summary=summary,
            why=why,
            reasons=reasons,
            key_factors=key_factors,
            action_steps=action_steps,
            safety_warnings=safety_warnings,
            environmental_impact=impact,
            device_snapshot=device,
        )

    # 3. REPAIR
    # If device has a repairable defect (broken screen, battery degradation, won't turn on but under 5 yrs old)
    is_recent_enough = answers.approximate_age in ["less_than_1_year", "1_to_3_years", "3_to_5_years"]
    is_repairable_problem = answers.main_problem in ["physical_damage", "battery_issue", "minor_issue", "major_issue"] or (answers.turns_on == "no" and is_recent_enough)

    if is_repairable_problem and is_recent_enough and answers.main_problem != "completely_non_functional":
        recommendation = "REPAIR"
        recommendation_label = "🔧 RECOMMENDED: REPAIR"
        confidence = "Medium" if answers.turns_on == "not_sure" else "High"

        reasons.append(f"The {device.device_type} is modern enough ({answers.approximate_age.replace('_', ' ')}) that component replacement is often economically and environmentally justified.")
        reasons.append("Repair preserves the majority of the manufactured sub-assemblies (chassis, processor, motherboard).")

        key_factors.append(f"Reported issue: {answers.main_problem.replace('_', ' ').capitalize()}")
        if device.visible_damage:
            key_factors.append(f"Visible damage: {', '.join(device.visible_damage)}")
        key_factors.append("Modern generation hardware worth preserving")

        summary = f"Repairing your {device.device_type} is likely cost-effective and avoids the carbon footprint of manufacturing a replacement."
        why = f"Your {device.device_type} has a localized defect ({answers.main_problem.replace('_', ' ')}), but because it is under 5 years old, professional part replacement (such as a fresh screen or modular battery) can restore years of active service."

        action_steps = [
            "Attempt data backup if screen or port connectivity allows (or cloud auto-backup).",
            "Obtain a repair diagnostic estimate from an authorized service provider or certified independent technician.",
            "Compare repair cost versus replacement: if repair is less than ~50% of the replacement price, repair is strongly advised.",
            "Inquire if genuine or OEM-equivalent parts with warranty are offered.",
            "If repair quotes exceed the device's market value, transition the device to responsible recycling."
        ]

        impact = estimate_environmental_impact(device.device_type, recommendation)
        return RecommendationResponse(
            recommendation=recommendation,
            recommendation_label=recommendation_label,
            confidence=confidence,
            summary=summary,
            why=why,
            reasons=reasons,
            key_factors=key_factors,
            action_steps=action_steps,
            safety_warnings=safety_warnings,
            environmental_impact=impact,
            device_snapshot=device,
        )

    # 4. RECYCLE
    # Device is obsolete (> 5 years), completely non-functional, or not repairable
    recommendation = "RECYCLE"
    recommendation_label = "♻️ RECOMMENDED: RECYCLE RESPONSIBLY"
    confidence = "High"

    if answers.turns_on == "no":
        key_factors.append("Does not power on")
    if answers.main_problem == "completely_non_functional":
        key_factors.append("Completely non-functional internal hardware")
    if answers.approximate_age == "more_than_5_years":
        key_factors.append("Hardware generation (>5 years) past operating system & security support")
    if device.visible_damage:
        key_factors.append(f"Significant physical wear: {', '.join(device.visible_damage)}")

    reasons.append("The device has reached its technological and operational end-of-life.")
    reasons.append("Attempting component repair on non-functional or obsolete hardware is typically uneconomical.")
    reasons.append("Certified recycling guarantees valuable elements (gold, silver, copper, rare earths) re-enter the circular supply chain.")

    summary = f"Your {device.device_type} has reached end-of-life and should be responsibly recycled to recover strategic materials and prevent landfill contamination."
    why = f"Based on the collected condition data, your {device.device_type} is non-operational or technologically obsolete. Disposing of it via regular municipal trash causes hazardous metal leaching. Recycling through accredited e-waste streams recovers scarce materials."

    action_steps = [
        "Check if you can perform a final data backup or extract removable storage (micro-SD cards).",
        "If the screen and power fail completely, verify if your cloud accounts can remotely unlink/erase the device.",
        "Remove and safely retain any non-integrated peripheral cables, chargers, or cases that can be reused.",
        "Never crush, disassemble, or tamper with sealed internal battery compartments.",
        "Bring the unit to an accredited e-waste drop-off bin, municipal electronic recycling event, or certified take-back retail location."
    ]

    impact = estimate_environmental_impact(device.device_type, recommendation)
    return RecommendationResponse(
        recommendation=recommendation,
        recommendation_label=recommendation_label,
        confidence=confidence,
        summary=summary,
        why=why,
        reasons=reasons,
        key_factors=key_factors,
        action_steps=action_steps,
        safety_warnings=safety_warnings,
        environmental_impact=impact,
        device_snapshot=device,
    )

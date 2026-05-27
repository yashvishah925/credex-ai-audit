# Product Analytics Infrastructure Matrix

## 1. The North Star Metric
Our single North Star metric is Total Confirmed Savings Identified (TCSI) per Week.

### Strategic Rationale:
Because this platform operates primarily as an automated lead-generation utility for Credex's deep enterprise program, standard engagement metrics like Daily Active Users (DAU) or Session Length are irrelevant. Users don't need to scroll this dashboard every day.

---

## 2. Core Input Metrics Model

To drive our North Star metric upward, our development team monitors three distinct input metrics:

1. Form Completion Velocity (FCV): The percentage conversion rate of unique landing visitors who successfully complete the tool input fields. A drop here alerts us that our input layout is causing user friction.
2. High-Waste Skew Ratio (HWSR): The percentage of completed audits tracking macro savings metrics exceeding $500/month. This metric tracks whether our organic distribution loops are effectively reaching teams at the right operational scale.
3. Lead Capture Activation Rate (LCAR): The percentage of high-waste profiles who submit their business email to lock in a consultation. This validates the effectiveness of our conditional CTA copy layout.

---

## 3. Instrumentation Blueprint

We will initialize tracking loops across three core user actions right out of the gate:
* audit_started_event: Fires the moment a user inputs their initial company team size parameters.
* tool_repeater_added: Logs the frequency and variety of AI platform tags selected by the user.
* lead_conversion_success: Fires as soon as the Supabase database confirms a successful row insert on the leads table, mapping input parameters directly to conversion states.

---

## 4. Definitive Pivot Decision Thresholds
We will maintain the framework in its current architecture unless the following validation boundaries are breached over a rolling 14-day sample window:

The Pivot Trigger: If the macro Lead Capture Activation Rate (LCAR) drops below 4% among high-waste profiles (surfacing over $500/mo in savings), we will immediately pivot the product's UX layer. This metric drop would prove that an interactive, self-serve dashboard isn't creating enough trust to capture high-intent leads. In that scenario, we would convert the application into a gated, white-glove reporting interface where users submit an anonymized CSV invoice to unlock their analysis paragraph.
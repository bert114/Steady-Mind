# PRD.md

## Project Overview

Aura is a wellness application for tracking emotional and social energy, predicting burnout risk, and generating personalized coaching for boundaries and recovery.

## Problem Statement

Users need a structured way to measure energy drain from daily interactions, identify burnout patterns early, and get practical guidance for setting boundaries and recovering their energy.

## Goals

- Track daily energy levels and social interactions.
- Predict burnout risk from repeated high-drain behavior or multi-day energy streaks.
- Generate personalized boundary-setting and wellness guidance using user-defined coping strategies.
- Provide analytics that correlate mood, energy, sleep, and relationship patterns.

## Target Users

- Individuals managing burnout, social fatigue, or emotional overload.
- Users who want to track how relationships affect their energy.
- Users who want AI-generated support for boundaries and recovery planning.

## Core Features

- Daily energy dashboard with a battery meter from 0 to 100.
- Social interaction logging with duration and drain score.
- Burnout risk detection based on consecutive high-drain events and multi-day low-battery streaks.
- Personal Coping Menu for user-curated recovery activities.
- Adaptive Recovery Reminders offering 2–3 low-friction choices when limits are hit.
- Coping mechanism feedback loop to track and rank activity effectiveness over time.
- Analytics for mood-to-energy and relationship impact.
- Boundary message templates and AI-generated scripts.
- Weekly AI-generated wellness insights.
- Wearable biometric data ingestion.

## Functional Requirements

- Users can log event type, duration, and perceived drain score.
- Users can log daily mood and current battery level.
- The system recalculates energy and burnout indicators in real-time after new logs.
- The system flags high burnout risk after 3 consecutive high-drain events without recovery or when a user reaches a 3-day low-battery streak.
- Users can input and manage a Personal Coping Menu categorized by effort level (low, medium, high) during onboarding and within profile settings.
- When an event trigger occurs (drain score <= -3, battery <= 30%, or a 3-streak limit), the system surfaces a Recovery Reminder modal with a curated list of 2–3 coping choices tailored to their current energy level.
- Users can rate the effectiveness of a selected coping activity ("Did this help?"), updating the activity's success score to prioritize high-performing recovery options in future triggers.
- The dashboard shows mood-to-energy charts over weekly and monthly periods.
- The dashboard shows a burnout risk dial with green, yellow, and red states.
- Users can categorize interactions by relationship type and add an optional name/label.
- The analytics view aggregates life-giving connections and high-drain dynamics.
- Users can request AI-generated boundary messages.
- The backend generates weekly coaching summaries using user metrics.
- The system accepts biometric data for sleep duration, resting heart rate, and HRV through an API endpoint.
- All authenticated app endpoints require Clerk-based access control.

## Non-functional Requirements

- Sensitive data must be encrypted at rest in PostgreSQL.
- Users must not be able to access another user’s records.
- Dashboard-related API requests should respond in under 250ms.
- OpenAI failures must fall back to local templates without breaking the UI.
- The UI must be mobile responsive.

---

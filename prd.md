# PRD.md

## Project Overview

Steady Mind is a wellness application that helps users understand how social interactions affect their emotional energy. By tracking daily mood, energy, and interactions, Steady Mind helps users recognize burnout patterns early and build healthier recovery habits.

## Problem Statement

Many people experience social fatigue or burnout without realizing which interactions or habits drain their energy. Steady Mind helps users track emotional energy, identify burnout risks before they become overwhelming, and receive personalized guidance for recovery and healthier boundaries.

## Goals

- Track daily mood, energy, and social interactions.
- Detect burnout risk using user activity patterns.
- Help users recover with personalized coping strategies.
- Provide meaningful insights into emotional and social energy trends.
- Encourage healthier boundaries through practical guidance.

## Target Users

- Individuals experiencing social fatigue or burnout.
- People who want to understand how relationships affect their emotional energy.
- Users looking for personalized wellness and recovery support.

## Core Features

### Daily Energy Tracking

Users record their daily energy level using a battery meter from 0 to 100 and log their current mood.

### Social Interaction Logging

Users record social interactions, including relationship type, duration, and perceived energy impact.

### Burnout Risk Detection

Steady Mind analyzes user activity to identify burnout risks based on repeated high-drain interactions and prolonged low-energy periods.

### Personal Coping Menu

Users create a personalized list of recovery activities categorized by effort level so recommendations match their available energy.

### Recovery Reminders

When burnout indicators are detected, Steady Mind recommends a small set of personalized recovery activities.

### Analytics Dashboard

The dashboard visualizes trends in mood, energy, burnout risk, and relationship impact over time.

### Boundary Support

Users can access boundary message templates and optionally personalize them with AI.

### Weekly Wellness Summary

Steady Mind generates a weekly summary highlighting mood trends, energy changes, burnout indicators, and recovery progress.

## Functional Requirements

- Users can create and manage an account.
- Users can log their daily mood and energy level.
- Users can log social interactions with relationship type, duration, and energy impact.
- Users can view historical mood, energy, and interaction records.
- The system recalculates burnout indicators whenever new data is recorded.
- The system identifies elevated burnout risk after repeated high-drain interactions or multiple consecutive low-energy days.
- Users can create, edit, and delete coping activities.
- The system recommends personalized recovery activities when burnout indicators are detected.
- Users can view weekly and monthly analytics for mood, energy, and relationship impact.
- Users can generate personalized boundary messages from built-in templates.
- The system generates a weekly wellness summary using the user's activity history.
- All user data is available only to the authenticated account owner.

## Non-functional Requirements

- User data must remain private and securely stored.
- Users must only access their own information.
- Dashboard interactions should feel responsive during normal use.
- The application must continue functioning if AI-powered features are unavailable by using built-in templates.
- The interface must support desktop and mobile devices.
- The system should use a modular architecture that supports future feature expansion.

## Success Metrics

- Users consistently log daily mood and energy.
- Users regularly record social interactions.
- Users receive timely burnout warnings before prolonged low-energy periods.
- Users engage with recommended recovery activities.
- Users gain meaningful insights from weekly wellness summaries and analytics.

## Future Enhancements

- Wearable device integration for automatic health data synchronization.
- Sleep tracking and recovery analysis.
- Biometric-based burnout prediction using heart rate variability and resting heart rate.
- Calendar integration for workload and recovery planning.
- Smart notifications based on user behavior.
- Machine learning models for personalized burnout prediction.
- Shared wellness features for families or teams.

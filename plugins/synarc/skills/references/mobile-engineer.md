---
title: "Mobile Engineer — Mobile-First Architecture & Offline-First Patterns"
type: reference
status: active
version: 1.0.0
updated: 2027-05-26
owner: synarc-core
tags:
  - mobile-engineer
  - mobile
  - ios
  - android
  - offline-first
  - memory-management
  - battery-optimization
  - app-lifecycle
  - push-notifications
  - mobile-security
  - cross-platform
  - network-layer
  - ui-performance
  - app-distribution
  - deep-linking
---

# Purpose

Mobile engineering execution model covering architecture patterns, offline-first design, platform-specific decisions, memory/battery optimization, app lifecycle, network-aware design, push notifications, and mobile security. Every decision considers device constraints: battery, memory, network, screen size, CPU thermal limits.

# Scope

App architecture patterns (MVC, MVP, MVVM, MVI, VIPER, Clean Architecture), navigation and routing (stack, tab, modal, drawer, coordinator), platform-specific decision patterns (iOS UIKit/SwiftUI, Android Jetpack Compose/XML), offline-first architecture (local-first reads, optimistic writes, sync engine, conflict resolution), memory management (ARC/iOS, GC/Android, image memory, list recycling), battery optimization (network batching, push over polling, location accuracy, CPU), app lifecycle and state management, UI rendering performance (layout, draw, render pipeline), network layer design (connectivity monitoring, retry strategies, caching), push notification architecture, mobile security (data storage, network, auth, code integrity), testing and CI/CD for mobile, distribution (App Store, Play Store, enterprise). Does not cover backend API design or infrastructure.

# Inputs

Platform requirements, device constraints, offline requirements, UI/UX specifications, distribution targets, app complexity.

# Output

Architecture pattern selection, platform split decisions, offline sync strategy, memory/battery budget, navigation flow, push notification design, security controls.

---

## 1. App Architecture Patterns

| Pattern | Platform | When to Use | Risk |
|---------|----------|-------------|------|
| MVVM | SwiftUI + ObservableObject, Jetpack Compose + ViewModel | Modern default — most apps | Massive ViewModels |
| MVI | Any (Rx/Combine/Flow) | Complex state, undo support | Boilerplate-heavy |
| VIPER | iOS (large apps) | Cleanest separation, multi-team | 5+ files per screen |
| Clean Architecture | Both (shared domain for KMM) | Testability, framework independence | Overkill for simple apps |

**Selection:** Simple (forms, lists) → MVVM. Medium (offline-first, sync) → MVVM + Clean Architecture or MVI + Clean. Large (multiple teams) → VIPER (iOS) or Clean Architecture + MVI.

## 2. Offline-First Architecture

**Principle:** Local data is source of truth for reads. Writes go to local first, sync in background. Users must never see a blank screen.

**Read path:** Repository exposes Flow/Observable from local DB → UI subscribes (renders immediately from cache) → remote fetch in background → local DB update → UI auto-updates. No loading spinners for cached data.

**Write path:** User action → ViewModel calls repository.write() → local DB write (optimistic) → enqueue sync → sync engine picks up: if online → execute API → update local with server response; if offline → keep in queue, retry with exponential backoff (max 3, max 60s backoff).

**Conflict strategies:** Last-write-wins (default — preferences), CRDT (convergence without coordination — counters, sets), Manual (present both — critical data), Custom merge (document merging).

## 3. Memory Management

**iOS (ARC):** strong (default, increments retain count), weak (auto-nil on dealloc), unowned (crash if deallocated). Common retain cycles: closure capturing self strongly (use [weak self]), delegate without weak, timer with strong target.

**Android (ART):** GC pauses 3-10ms. Common issues: Activity leaks (static reference, inner class), Bitmap leaks (not recycling), Context leaks (singleton holding Activity), Handler leaks (delayed messages after Activity destroyed).

**Image memory:** bitmap = width × height × 4 bytes. Always downsample to display size. Memory cache LRU at ~25% of heap. Disk cache as second level. Cancel image loads on view recycle.

## 4. Battery Optimization

**Cost hierarchy (expensive → cheap):** Radio (cellular) > Screen (high brightness) > GPS > CPU (high freq) > Keep-alive.

**Network:** batch multiple calls into 1-2 on app start, debounce rapid writes (500ms), prefer push over polling. Polling backoff: 30s online → 5min after first failure → double each time (max 1hr). Detect connection type — reduce data on cellular.

**Location:** use minimum accuracy. Weather → coarse (city). Nearby places → balanced (block). Navigation → fine (street). Use region monitoring (geofencing) over continuous GPS.

**Low power mode:** detect (iOS: isLowPowerModeEnabled, Android: isPowerSaveMode) → reduce network, lower frame rate, decrease location accuracy, skip non-critical background work.

## 5. App Lifecycle

**Flow:** not running → foreground active → foreground inactive → background → suspended → terminated.

**Foreground → Background:** save draft/editing state, stop animations/timers, release exclusive resources (camera, mic, high-power location), schedule background sync, save scroll position.

**Background → Foreground:** check connectivity, process pending sync queue, refresh stale data (if > freshness TTL), restore navigation state, handle pending deep links.

**State persistence:** save to persistent storage on termination (drafts, cart). If stale (>24h since last use), start fresh instead of restoring.

## 6. UI Rendering Performance

**Frame budget:** 60fps = 16.67ms, 120fps = 8.33ms. Pipeline: Layout (CPU) → Draw (CPU) → Render (GPU).

**iOS:** Auto Layout constraint resolution O(n²) — use manual frames or UIStackView for linear layouts. SwiftUI: LazyVStack/LazyHStack for scrollable content, avoid unnecessary @State reads.

**Android (Compose):** LazyColumn/LazyRow, Modifier ordering (size first, appearance last), @Stable/@Immutable for data classes. XML: ConstraintLayout (flat hierarchy), ViewStub for lazy inflation.

**Recycling:** UICollectionView dequeueReusableCell with prepareForReuse. RecyclerView ViewHolder with DiffUtil. Cancel async work on recycle. Target <1% frame drops.

## 7. Network Layer Design

**Layers:** Network Interface (HTTP client) → API Service (endpoint definitions) → Repository (local + remote) → Sync Engine (offline queue, retry, conflicts) → Connectivity Monitor.

**Retry:** transient errors (timeout, 503, 429) → retry with exponential + jitter (max 3 user-initiated, 5 background). Persistent errors (400, 401, 404, 500) → no retry, surface to user or dead letter.

**Caching:** L1 in-memory (session), L2 disk (HTTP cache, DB), L3 server (ETag). Freshness TTL: static content 1hr, semi-static 5min, dynamic 30s, real-time no cache.

## 8. Platform-Specific Decisions

**Native (Swift + Kotlin)** when: platform-specific UI critical (camera, AR, custom gestures), performance-critical (video, rendering), early platform API access, extensive platform integrations (HealthKit, Wallet, NFC, CarPlay).

**Cross-platform (Flutter, React Native, KMM)** when: shared business logic priority, rapid development/small team, standard UI, MVP/prototype stage.

## 9. Push Notifications

**iOS:** APNS via UNUserNotificationCenter. Remote notification payload (alert, sound, badge). Notification Service Extension for content modification. Rich notifications with media attachments.

**Android:** FCM via NotificationCompat. Notification channels for categories. Direct reply actions. Notification importance levels (HIGH → heads-up, DEFAULT → sound, LOW → no sound, MIN → no display).

**Both:** register on first launch, refresh token on change, handle tap action (deep link to relevant screen), clear notifications when user views content.

module.exports = {
  generateS10(w) {
    w('## S10 — SCALE FACTORS');
    w('');
    w('Scale determines the depth of context injection, checkpoint frequency, brain file maintenance, and risk sensitivity. Scale is auto-detected from project characteristics: number of files, LOC, modules, services, team size, and regulatory requirements.');
    w('');
    w('### Scale Levels');
    w('');
    w('| Scale | Files | LOC | Modules | Tracking Depth | Injection | Checkpoints | Brain Files |');
    w('|-------|-------|-----|---------|----------------|-----------|-------------|-------------|');
    w('| NANO | 1-3 | <500 | 1 | WorkType + risk | SILENT | None | None |');
    w('| MICRO | 3-10 | <5K | 1-3 | + files touched | COMPACT | On scope change | CURRENT_STATE.md |');
    w('| SMALL | 10-50 | 5K-50K | 3-8 | + ledger, risks | STANDARD | Per task | All brain files |');
    w('| MEDIUM | 50-200 | 50K-500K | 5-20 | Full ledger | STANDARD | Per change set | All + CHANGE_LOG |');
    w('| LARGE | 200-1000 | 500K-5M | 10-50 | Service-boundary | FULL | Per service boundary | All + service maps |');
    w('| ENTERPRISE | 1000+ | 5M+ | 50+ | Compliance audit | FULL + pre-write | Per mutation | All + audit |');
    w('');
    w('### Scale Auto-Detection Signals');
    w('');
    w('| Signal | Scale Indicator |');
    w('|--------|----------------|');
    w('| Single file project | NANO |');
    w('| Small directory with single module | MICRO |');
    w('| Monolith app, single package | SMALL |');
    w('| Multiple packages, single service | MEDIUM |');
    w('| Multiple services, shared infra | LARGE |');
    w('| Multi-service, multi-region, compliance | ENTERPRISE |');
    w('| /brain/ contains service registry | ENTERPRISE forced |');
    w('| Regulatory config detected (HIPAA, PCI) | ENTERPRISE forced |');
    w('');
    w('Scale transitions are seamless. Synarc scales up as the project grows without configuration changes. Downscaling is possible but rare — once a project reaches MEDIUM, it rarely goes back to SMALL.');
    w('');
    w('Load references/project-scales.md for complete scale detection algorithms, behavioral adaptation patterns, and scale-specific configuration options.');
    w('');
  }
};

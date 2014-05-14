package com.rtr.alchemy.caching;

import org.joda.time.DateTime;
import org.joda.time.Duration;

/**
 * This caching strategy will periodically check whether the data in the cache is stale, and if so, refresh it.
 * The periodic checking of staleness is driven by cache reads, so, any time the cache is read, if it's been a while
 * since the last refresh and the data is stale, the cache will be refreshed.
 */
public class PeriodicStaleCheckingCacheStrategy extends BasicCacheStrategy {
    private final Duration period;
    private volatile DateTime lastSync;

    public PeriodicStaleCheckingCacheStrategy(Duration period) {
        this.period = period;
        this.lastSync = DateTime.now();
    }

    @Override
    public void onCacheRead(String experimentName, CachingContext context) {
        invalidateAllIfStale(context);
    }

    @Override
    public void onCacheRead(CachingContext context) {
        invalidateAllIfStale(context);
    }

    private void invalidateAllIfStale(CachingContext context) {
        final Duration elapsed = new Duration(lastSync, DateTime.now());

        if (elapsed.isLongerThan(period)) {
            lastSync = DateTime.now();
            if (context.checkIfAnyStale()) {
                context.invalidateAll(true);
            }
        }
    }
}

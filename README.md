# k6-tests

K6 load testing via GitHub Actions. Workflow runs a k6 tests, and the test results will be available on external Grafana or as an ``HTML`` \ ``TXT`` artifact of Workflow.

The ``ramping-arrival-rate`` was chosen as the executor for testing since the weather application API most often receives single requests from users. Users usually visit weather forecast services to see the forecast for a specific city.
For the stress test limit set to ``1000rp/s``, k6 adjusts the number of users automatically. The test also includes ``1rp/s`` ``PUT`` to simulate weather updates.

Normal load test is limited to ``500rp/s``

---

### SLO/SLA:
+ request latency p(95) < *250ms*
+ failed http requests < *1%*

---

### Tests:
- Load test for normal load conditions:
  - [![K6 load test](https://github.com/fishaffair/k6-tests/actions/workflows/k6-load-test.yml/badge.svg)](https://github.com/fishaffair/k6-tests/actions/workflows/k6-load-test.yml)
  
- Stress test for simulate above average load:
  - [![K6 stress test](https://github.com/fishaffair/k6-tests/actions/workflows/k6-stress-test.yml/badge.svg)](https://github.com/fishaffair/k6-tests/actions/workflows/k6-stress-test.yml)

- Breakpoint test for finding maximum load to handle SLO/SLA:
  - [![K6 breakpoint test](https://github.com/fishaffair/k6-tests/actions/workflows/k6-breakpoint-test.yml/badge.svg)](https://github.com/fishaffair/k6-tests/actions/workflows/k6-breakpoint-test.yml) always passing 😃
    - System's found maximums after several tests (only read):
	
        | VUS | RPS |
        | --- | --- |
        | 345 | 1.9k |
        | 426 | 1.6k |
		

## Conclusion
The bottleneck seems to be the in the k8 infrastructure pod CPU. 
After running the breakpoint test, the degradation of latency is noted due to k8s pods bumping to internal CPU limits. At the same time, the database cluster is not peaking to the CPU and I/O limits.

<details>
  <summary>Graphs and stats</summary>
  
  ![Alt text](/img/k6.png "Visual stats from k6")
  
  ![Alt text](/img/k8s.png "Visual stats from k8s")
  
  ![Alt text](/img/hosts.png "Visual stats from hosts")
  
</details>
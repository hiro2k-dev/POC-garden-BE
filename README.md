# ESP32 WebSocket

## Communication option

| Option         | Pros                          | Cons                        | Use When?                      |
|----------------|-------------------------------|-----------------------------|--------------------------------|
| **WebSocket**  | Real-time, bidirectional       | No built-in QoS/retry       | Low-latency control UI         |
| **MQTT**       | Lightweight, scalable, reliable| More setup (broker needed)  | IoT scale, need message queue  |
| **HTTP REST**  | Simple to implement            | No push, polling required   | Manual control, no real-time   |



## POC
### Communication protocol
- FE -- BE: WebSocket (ws)
- BE -- ESP32: WebSocket client

### Device
MCU: ESP32:

* ESP32 control single relay
* ESP32 control multiple relay

This will depend on implementation

### client
* Webapp: ReactJS(POC included)
* Mobile App: React Native - Expo (POC included)
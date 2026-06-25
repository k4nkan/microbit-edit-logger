//% color="#4051B5" icon="\uf1da" block="Edit Logger"
namespace editLogger {
  let sensorLogging = false;
  let sensorIntervalMs = 1000;

  //% block="edit logger is enabled"
  export function isEnabled(): boolean {
    return true;
  }

  //% block="start sensor logging every $intervalMs ms"
  //% intervalMs.defl=1000 intervalMs.min=100 intervalMs.max=60000
  export function startSensorLogging(intervalMs: number): void {
    if (intervalMs < 100) intervalMs = 100;
    if (intervalMs > 60000) intervalMs = 60000;
    sensorIntervalMs = intervalMs;

    if (sensorLogging) return;
    sensorLogging = true;

    control.inBackground(function () {
      while (sensorLogging) {
        writeSensorLog();
        basic.pause(sensorIntervalMs);
      }
    });
  }

  //% block="stop sensor logging"
  export function stopSensorLogging(): void {
    sensorLogging = false;
  }

  function writeSensorLog(): void {
    serial.writeLine(
      "EL_SENSOR," +
        input.runningTime() +
        "," +
        input.acceleration(Dimension.X) +
        "," +
        input.acceleration(Dimension.Y) +
        "," +
        input.acceleration(Dimension.Z) +
        "," +
        input.lightLevel() +
        "," +
        input.temperature(),
    );
  }
}

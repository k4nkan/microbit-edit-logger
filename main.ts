//% color="#4051B5" icon="\uf1da" block="Edit Logger"
namespace editLogger {
  const minSensorIntervalMs = 100;
  const maxSensorIntervalMs = 60000;
  const sensorLogPrefix = "EL_SENSOR";

  let sensorLogging = false;
  let sensorIntervalMs = 1000;

  //% block="edit logger is enabled"
  export function isEnabled(): boolean {
    return true;
  }

  //% block="start sensor logging every $intervalMs ms"
  //% intervalMs.defl=1000 intervalMs.min=100 intervalMs.max=60000
  export function startSensorLogging(intervalMs: number): void {
    sensorIntervalMs = clampSensorInterval(intervalMs);

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
      sensorLogPrefix +
        "," +
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
        input.temperature() +
        "," +
        pressedFlag(input.buttonIsPressed(Button.A)) +
        "," +
        pressedFlag(input.buttonIsPressed(Button.B)) +
        "," +
        pressedFlag(input.logoIsPressed()) +
        "," +
        input.soundLevel() +
        "," +
        input.compassHeading(),
    );
  }

  function clampSensorInterval(intervalMs: number): number {
    if (intervalMs < minSensorIntervalMs) return minSensorIntervalMs;
    if (intervalMs > maxSensorIntervalMs) return maxSensorIntervalMs;
    return intervalMs;
  }

  function pressedFlag(isPressed: boolean): number {
    return isPressed ? 1 : 0;
  }
}

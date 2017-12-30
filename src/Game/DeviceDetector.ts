
export class DeviceDetector
{
    private device: Phaser.Device;

    constructor(device: Phaser.Device)
    {
        this.device = device;
    }

    isMobile()
    {
        return this.device.android;
    }
}

import {ElectricSheep} from "./ElectricSheep";
import {Big} from "./Big";
import {Buildings} from "./Buildings";
import {Building} from "./Building";
import {Pub} from "./Pub";
import {Medium} from "./Medium";
import {Small} from "./Small";
import {Level} from "../Game/Level";

export class BuildingLayout
{
    private group: Phaser.Group;
    private buildingY = 100;
    private isometricMargin = 50;
    private previousBuildingMargin = 6;
    private previousBuilding: Phaser.Sprite = null;
    private buildingsRepository: Buildings;

    constructor(level: Level, group: Phaser.Group)
    {
        this.group = group;
        this.buildingsRepository = new Buildings();
        level.orderedBuildingTypes().forEach(
            function (type: string) {
                switch (type) {
                    case 'Small':
                        this.addSmall();
                        break;
                    case 'Medium':
                        this.addMedium();
                        break;
                    case 'Big':
                        this.addBig();
                        break;
                    case 'Pub':
                        this.addPub();
                        break;
                    case 'ElectricSheep':
                        this.addElectricSheep();
                        break;
                    default:
                        throw new Error("Building type "+type+" is unknown");
                }
            },
            this
        );
    }

    streetWidth(): number
    {
        return this.previousBuilding.x + this.previousBuilding.width;
    }

    buildings(): Buildings
    {
        return this.buildingsRepository;
    }

    private addElectricSheep(): ElectricSheep
    {
        return this.addBuilding(new ElectricSheep(this.group, this.buildPositionX(), this.buildingY));
    }

    private addPub(): Pub
    {
        return this.addBuilding(new Pub(this.group, this.buildPositionX(), this.buildingY));
    }

    private addBig(): Big
    {
        return this.addBuilding(new Big(this.group, this.buildPositionX(), this.buildingY));
    }

    private addMedium(): Medium
    {
        return this.addBuilding(new Medium(this.group, this.buildPositionX(), this.buildingY));
    }

    private addSmall(): Small
    {
        return this.addBuilding(new Small(this.group, this.buildPositionX(), this.buildingY));
    }

    private addBuilding(building: Building): Building
    {
        this.previousBuilding = building;
        this.group.sort('x', Phaser.Group.SORT_DESCENDING);
        this.buildingsRepository.add(building);

        return building;
    }

    private buildPositionX(): number
    {
        if (this.previousBuilding === null) {
            return 0 - this.isometricMargin;
        } else {
            return this.previousBuilding.x + this.previousBuilding.width - this.isometricMargin - this.previousBuildingMargin;
        }
    }

}
import { Raycaster, Vector3, Camera, ArrayCamera, Object3D, Intersection } from "three";

// 実装してみたが、差し替え手段がなかった（わからなかった）
export class MultiCameraRaycaster extends Raycaster {
  casters: Array<Raycaster> = []

	/**
	 * This creates a new raycaster object.
	 * @param origin The origin vector where the ray casts from.
	 * @param direction The direction vector that gives direction to the ray. Should be normalized.
	 * @param near All results returned are further away than near. Near can't be negative. Default value is 0.
	 * @param far All results returned are closer then far. Far can't be lower then near . Default value is Infinity.
	 */
	constructor(
		origin?: Vector3,
		direction?: Vector3,
		near?: number,
		far?: number
	) {
    super(origin, direction, near, far)
    this.casters = [new Raycaster(origin, direction, near, far)]
  }

	/**
	 * Updates the ray with a new origin and direction.
	 * @param origin The origin vector where the ray casts from.
	 * @param direction The normalized direction vector that gives direction to the ray.
	 */
	set( origin: Vector3, direction: Vector3 ): void {
    console.log('my laycaster!!! set')
    for (const caster of this.casters) {
      caster.set(origin, direction)
    }
  }

	/**
	 * Updates the ray with a new origin and direction.
	 * @param coords 2D coordinates of the mouse, in normalized device coordinates (NDC)---X and Y components should be between -1 and 1.
	 * @param camera camera from which the ray should originate
	 */
	setFromCamera( coords: { x: number; y: number }, camera: Camera ): void {
    console.log('my laycaster!!! fromCamera')
    const isArrayCamera = (item: any): item is ArrayCamera => item.isArrayCamera;
    if (isArrayCamera(camera)) {
      this.casters = camera.cameras.map((c) => {
        const caster = new Raycaster(void 0, void 0, this.near, this.far)
        caster.setFromCamera(coords, c)
        return caster
      })
    } else {
      const caster = new Raycaster(void 0, void 0, this.near, this.far)
      caster.setFromCamera(coords, camera)
      this.casters = [caster]
    }
  }

	/**
	 * Checks all intersection between the ray and the object with or without the descendants. Intersections are returned sorted by distance, closest first.
	 * @param object The object to check for intersection with the ray.
	 * @param recursive If true, it also checks all descendants. Otherwise it only checks intersecton with the object. Default is false.
	 * @param optionalTarget (optional) target to set the result. Otherwise a new Array is instantiated. If set, you must clear this array prior to each call (i.e., array.length = 0;).
	 */
	intersectObject(
		object: Object3D,
		recursive?: boolean,
		optionalTarget?: Intersection[]
	): Intersection[] {
    console.log('my laycaster!!!')
    return this.casters.flatMap((caster) => caster.intersectObject(object, recursive, optionalTarget))
  }
}
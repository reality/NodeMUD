/**
 * Notes: 
 *
 * - Objects have a static ID meaning that when an object is destroyed it must
 *      not have its entry in the global object sliced 

 * Special objects:
 *  ID 0: The Global Object - Everything is eventually contained by this.
 *  ID 1: Globals Object - Everything in here is globally available.
 *
 * All well and good, however, using prototypal inheritance, but the real
 * problem is the question of how to globally index the objects.
 *
 * I think it's possible to have a 'contents' property of objects and only
 * within these constraints are the 'name' indexes required to be kept unique.
 * For example:
 * 
 * this.db.objects = [
 *   {
 *      id: 0,
 *      name: 'turtles',
 *      type: 'commands'
 *   },
 *   {
 *      id: 1,
 *      name: 'turtle_room',
 *      type: 'room',
 *      contents: {
 *          'turtles': 0
 *      }
 *   }
 * ]
 *
 */

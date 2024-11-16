class Stack {
    constructor() {
      this.head = null;
    }
  
    push(data) {
      const newNode = new StackNode(data);
      newNode.next = this.head;
      this.head = newNode;
    }
  
    pop() {
      if (this.head === null) {
        console.error("error");
        return null;
      }
      const temp = this.head;
      this.head = this.head.next;
      return temp.data;
    }
  
    top() {
      return this.head;
    }
  
    display() {
      let currentNode = this.head;
      let output = '';
      while (currentNode !== null) {
        output += currentNode.data + '->';
        currentNode = currentNode.next;
      }
      console.log(output.slice(0, -2));
    }
}
  
class StackNode {
    constructor(data) {
      this.data = data;
      this.next = null;
    }
}

class Edge {
    constructor(data, origin, destination) {
      this.origin = origin;
      this.destination = destination;
      this.distance = data;
    }
}
  
class Vertex {
    constructor(data, msc, x, y, ht) {
      this.data = data;
      this.position = [x, y ];
      this.type = "tower";
      this.msc = msc;
      this.radius = this.coverageArea(ht);
      this.div=null;
    }
  
    coverageArea(ht, hr = 1.5) {
      return Math.sqrt(2 * ht) + Math.sqrt(2 * hr);
    }
}

class TelephoneHashMap {
    constructor(capacity = 100) {
      this.capacity = capacity;
      this.size = 0;
      this.buckets = Array.from({ length: capacity }, () => []);
    }
  
    telephoneHash(phoneNumber) {
      if (phoneNumber < 1000000000 || phoneNumber > 9999999999) {
        throw new Error("Input must be a 10-digit telephone number.");
      }
  
      const part1 = Math.floor(phoneNumber / 100000);
      const part2 = phoneNumber % 100000;
      const combinedValue = part1 ^ part2;
      return combinedValue % this.capacity;
    }
  
    put(phoneNumber, value) {
      const index = this.telephoneHash(phoneNumber);
      const bucket = this.buckets[index];
  
      for (let i = 0; i < bucket.length; i++) {
        if (bucket[i][0] === phoneNumber) {
          bucket[i][1] = value;
          return;
        }
      }
  
      bucket.push([phoneNumber, value]);
      this.size += 1;
    }
  
    get(phoneNumber) {
      const index = this.telephoneHash(phoneNumber);
      const bucket = this.buckets[index];
  
      for (const [pn, v] of bucket) {
        if (pn === phoneNumber) return v;
      }
      return null;
    }
  
    remove(phoneNumber) {
      const index = this.telephoneHash(phoneNumber);
      const bucket = this.buckets[index];
  
      for (let i = 0; i < bucket.length; i++) {
        if (bucket[i][0] === phoneNumber) {
          bucket.splice(i, 1);
          this.size -= 1;
          return true;
        }
      }
      return false;
    }
  
    toString() {
      return JSON.stringify(this.buckets);
    }
}

  
class MSCVertex {
  static mainDirectory=new TelephoneHashMap();
  constructor(data, x, y) {
    this.data = data;
    this.position = [x,y];
    this.radius = 0;
    this.type = "msc";
    this.div=null;
    this.directory = new TelephoneHashMap();
  }
}


class User {
    constructor(data, number, x, y) {
      this.data = data;
      this.position = { x, y };
      this.number = number;
      this.connectedTower = null;
    }
}

class Network {
    constructor(name,x,y) {
      this.msc = new MSCVertex(name, x, y);
      this.outgoing = new Map();
      this.outgoing.set(this.msc,new Map());
      this.notowers=0;
    }
  
    getDistance(x1, y1, x2, y2) {
      return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }
  
    isIntersecting(x, y, x1, y1, d) {
      return (x - x1) ** 2 + (y - y1) ** 2 <= d ** 2;
    }
  
    isCoverageIntersecting(x1, y1, r1, x2, y2, r2) {
      const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
      return distance <= r1 + r2;
    }
  
    getPathToMSC(start) {
      const stack = new Stack();
      stack.push([start, [start]]);
      const visited = new Set();
  
      while (stack.top()) {
        const [current, path] = stack.pop();
        if (current.type === "msc") return path;
        if (!visited.has(current)) {
          visited.add(current);
          for (const [neighbor,edge] of this.outgoing.get(current)) {
            if (!visited.has(neighbor)){
              stack.push([neighbor, path.concat(neighbor)]);
            }
          }
        }
      }
      return null;
    }
  
    insertVertex(name,x,y,ht) {
      const v = new Vertex(name, this.msc, x, y, ht);
      let minDistance = Infinity;
      let nearestVertex = null;
      const distanceToV = new Map();
  
      for (const vertex of this.outgoing.keys()) {
        const distance = this.getDistance(vertex.position[0], vertex.position[1], v.position[0], v.position[1]);
        distanceToV.set(vertex, distance);
        if (distance < minDistance) {
          minDistance = distance;
          nearestVertex = vertex;
        }
      }

  
      if (nearestVertex !== this.msc) {
        if (this.isCoverageIntersecting(x, y, v.radius, nearestVertex.position[0], nearestVertex.position[1], nearestVertex.radius)) {
          console.log("Intersecting...");
          return [nearestVertex,false];
        }
      }
  
      this.outgoing.set(v, new Map());
      this.insertEdge(minDistance, nearestVertex, v);
      this.insertEdge(minDistance, v, nearestVertex);
      distanceToV.set(v, 0);
      return [nearestVertex,true];
    }
  
    insertEdge(data, u, v) {
      const edge = new Edge(data, u, v);
      this.outgoing.get(u).set(v, edge);
    }

    addUser(name, number, x, y) {
      const newUser = new User(name, number, x, y);
      console.log(name,number,x,y);
      MSCVertex.mainDirectory.put(number,this.msc);
      for (const vertex of this.outgoing.keys()){
          if (this.isIntersecting(x, y, vertex.position[0], vertex.position[1], vertex.radius)) {
              newUser.connectedTower = vertex;
              console.log("adding data to mnc");
              // this.connectToMSC(newUser);
              return [newUser,true];
          }
      }
      return[newUser,false];
    }


    establishCall(number_1, number_2) {
      const msc = MSCVertex.mainDirectory.get(number_1);
      const user_1 = msc.directory.get(number_1);
      const userMscPath = this.getPathToMSC(user_1.connectedTower);

      // Print the path for user 1
      userMscPath.forEach(path => {
          console.log(path.data, " ");
      });
      console.log();

      // Print call status
      console.log("Call established");
    }



  
    displayDetails() {
      for (const [vertex, edges] of this.outgoing.entries()) {
        if (vertex === this.msc) continue;
        console.log(vertex.radius);
        for (const [neighbor, edge] of edges.entries()) {
          console.log(`${vertex.data} ---> ${neighbor.data}`);
        }
      }
    }
}
  

export default Network;
  
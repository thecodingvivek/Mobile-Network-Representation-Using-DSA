import Network from "./MobileNetwork";

class Mapper{
    constructor(){
        this.canvas=null;
        this.ctx = null;
        this.network=null;
    }

    initMapper(name){
        this.canvas=document.getElementById('canv');
        this.ctx=this.canvas.getContext('2d');
        this.network=new Network(name,this.canvas.width/2,this.canvas.height/2)
        console.log(this.network);
        window.addEventListener("resize",()=>{
            this.resizeCanvas();
        });

        // this.cursorCoverage();
        window.addEventListener("click",(event)=>{
            const rect = this.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const output=this.network.insertVertex(x,y,1000);
            if (output[1]){
                this.createGraphReprentations();
            }
            else{
            }
        });
        this.drawAxes();
    }


    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.drawAxes();
        // drawGraph(); // Redraw the graph after resizing
    }

    createGraphReprentations(){
        const context = this.canvas.getContext('2d');
        for(let [vertex,neighbor] of this.network.outgoing)
        {
            console.log('yoo',vertex);
            context.fillStyle = '#0a9396';
            context.beginPath();
            context.arc(vertex.position[0], vertex.position[1], 5, 0, Math.PI * 2);
            context.fill();
            // this.addCoverage(vertex);

        }
        this.drawEdges();
    }
    

    drawAxes(){
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const scale = 20; // scale factor to adjust the unit size

        this.ctx.beginPath();
        this.ctx.moveTo(0, centerY);
        this.ctx.lineTo(this.canvas.width, centerY);
        this.ctx.strokeStyle = 'gray';
        this.ctx.stroke();
        this.ctx.closePath();
    
        // Y-axis
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, 0);
        this.ctx.lineTo(centerX, this.canvas.height);
        this.ctx.strokeStyle = 'gray';
        this.ctx.stroke();
        this.ctx.closePath();

        const canvasX = centerX;
        const canvasY = centerY;

        this.ctx.beginPath();
        this.ctx.arc(canvasX, canvasY, 5, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = "red";
        this.ctx.fill();
        this.ctx.closePath();
    }

    plotPoint(x, y, color = 'blue') {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x,y, 5, 0, Math.PI * 2);
        this.ctx.fill();
    }


    drawEdges(){
        for(let [vertex,neighbor] of this.network.outgoing)
        {
            for(let [v,edge] of neighbor)
            {
                this.ctx.moveTo(vertex.position[0],vertex.position[1]);
                this.ctx.lineTo(v.position[0],v.position[1]);
                this.ctx.strokeStyle = "#343a40";
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
                this.ctx.closePath();
            }
        }
    }


    addCoverage(vertex){
        let div=document.createElement("div");
        div.className="on_coverage_circle";
        div.style.left=vertex.position[0]-vertex.radius+"px";
        div.style.top=vertex.position[1]-vertex.radius+"px";
        div.style.width=parseFloat(vertex.radius*2)+"px";
        document.body.appendChild(div);
        vertex.div=div;
    }

    cursorCoverage(){
        let coverage=document.getElementsByClassName("cursor_coverage")[0];
        coverage.style.display="flex";
        const rect = this.canvas.getBoundingClientRect();
        document.addEventListener("mousemove", (e) => {
            coverage.style.top = (e.clientY - rect.top) - (coverage.offsetWidth / 2) + "px";
            coverage.style.left = (e.clientX - rect.left) - (coverage.offsetHeight / 2) + "px";
            for(const [vertex,edge] of this.network.outgoing)
            {
                try{

                    if(this.network.isCoverageIntersecting(e.clientX,e.clientY,25,vertex.position[0],vertex.position[1],vertex.radius))
                    {
                        vertex.div.className="coverage_circle";
                    }
                    else{
                        vertex.div.className="on_coverage_circle";
                    }
                }
                catch{

                }
            }
        });
    }
}

export default Mapper;
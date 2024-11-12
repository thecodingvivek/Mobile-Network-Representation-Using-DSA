import Network from "./MobileNetwork";

class Mapper{
    constructor(){
        this.canvas = null;
        this.ctx = null;
        this.network = null;
        this.mm=null;
        this.el_cursorCoverage = this.el_cursorCoverage.bind(this);
        this.el_userAdd = this.el_userAdd.bind(this);
        this.ua=null;
    }

    initMapper(name){
        this.canvas=document.getElementById('canv');
        this.ctx=this.canvas.getContext('2d');
        this.network=new Network(name,this.canvas.width/2,this.canvas.height/2)
        console.log(this.network);
        window.addEventListener("resize",()=>{
            this.resizeCanvas();
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
            this.addCoverage(vertex);
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


    addTower(event){
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const output=this.network.insertVertex(x,y,1000);
        console.log(output);
        if (output[1]){
            this.createGraphReprentations();
        }
        else{
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

    el_cursorCoverage(e){
        let coverage=document.getElementsByClassName("cursor_coverage")[0];
        coverage.style.display="flex";
        const rect = this.canvas.getBoundingClientRect();
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
    }
    

    el_userAdd(e,r,d){
        d.style.top = (e.clientY - r.top) + "px";
        d.style.left = (e.clientX - r.left) + "px";
    }
    cursorCoverage(){
        window.addEventListener("mousemove",this.el_cursorCoverage);
    }




    addUser(){
        document.getElementsByClassName("cursor_coverage")[0].style.display="none";
        window.removeEventListener("mousemove", this.el_cursorCoverage);

        let div=document.createElement("div");
        div.className="user";
        document.body.appendChild(div);
        const rect = this.canvas.getBoundingClientRect();
        this.ua = (e) => this.el_userAdd(e, rect, div);
        document.body.addEventListener("mousemove",()=>this.ua);

        const au=document.addEventListener("click",(e)=>{
            console.log(document.elementFromPoint(e.clientX,e.clientY));
            if(document.elementFromPoint(e.clientX,e.clientY).className=="on_coverage_circle" || document.elementFromPoint(e.clientX,e.clientY).tagName=="CANVAS")
            {
                const rect = this.canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const output=this.network.addUser("u"+x,9652314347,x,y);
                let div=document.createElement("div");
                div.className="user";
                document.body.appendChild(div);
                div.style.top = (e.clientY - rect.top)  + "px";
                div.style.left = (e.clientX - rect.left)+ "px";
                if (output[1]){
                    document.removeEventListener("mousemove",this.ua);
                }
                else{
    
                }
            }
        });
    }
}

export default Mapper;
import { useEffect, useRef } from 'react';

export default function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // 设置画布全屏
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray = [];
    
    // 鼠标对象
    let mouse = {
      x: null,
      y: null,
      radius: 150 // 鼠标交互半径
    };

    // 监听鼠标移动
    window.addEventListener('mousemove', (event) => {
      mouse.x = event.x;
      mouse.y = event.y;
    });

    // 监听鼠标移出，防止粒子一直躲避一个看不见的点
    window.addEventListener('mouseout', () => {
      mouse.x = undefined;
      mouse.y = undefined;
    });

    // 监听窗口大小改变
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init(); // 重新初始化粒子
    });

    // 粒子类 (造轮子核心)
    class Particle {
      constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
      }

      // 绘制单个粒子
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = '#8b5cf6'; // 科技紫，你可以换成喜欢的颜色
        ctx.fill();
      }

      // 更新粒子位置（包含物理碰撞和鼠标斥力计算）
      update() {
        // 碰到屏幕边缘反弹
        if (this.x > canvas.width || this.x < 0) {
          this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.directionY = -this.directionY;
        }

        // 碰撞检测：计算鼠标位置和粒子位置的距离
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        // 如果鼠标离粒子很近，产生斥力推开粒子
        if (distance < mouse.radius + this.size) {
          if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
            this.x += 10;
          }
          if (mouse.x > this.x && this.x > this.size * 10) {
            this.x -= 10;
          }
          if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
            this.y += 10;
          }
          if (mouse.y > this.y && this.y > this.size * 10) {
            this.y -= 10;
          }
        }
        
        // 正常按自身速度移动
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
      }
    }

    // 初始化粒子群
    function init() {
      particlesArray = [];
      let numberOfParticles = (canvas.height * canvas.width) / 9000; // 根据屏幕大小决定粒子数量
      for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 3) + 1; // 随机大小
        let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
        // 随机移动速度和方向
        let directionX = (Math.random() * 2) - 1; 
        let directionY = (Math.random() * 2) - 1;
        let color = '#8b5cf6';

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
      }
    }

    // 粒子之间的连线逻辑
    function connect() {
      let opacityValue = 1;
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
            + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
          
          // 如果两个粒子距离小于某值，画线
          if (distance < (canvas.width / 7) * (canvas.height / 7)) {
            opacityValue = 1 - (distance / 20000); // 距离越远，线越透明
            ctx.strokeStyle = `rgba(139, 92, 246, ${opacityValue})`; // 线条颜色和透明度
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    }

    // 动画循环
    function animate() {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height); // 每帧清空画布
      
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
      }
      connect();
    }

    // 启动！
    init();
    animate();

    // 组件卸载时清理，防止内存泄漏
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', () => {});
      window.removeEventListener('resize', () => {});
    };
  }, []);

  // 将 canvas 固定在页面最底层 (-z 轴) 作为背景
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-auto bg-gray-50"
    />
  );
}
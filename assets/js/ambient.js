// Advanced Apple-like glowing orb background
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('ambient-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let orbs = [];

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    window.addEventListener('resize', resize);
    resize();

    class Orb {
        constructor(color) {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.radius = Math.random() * 300 + 200;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.color = color;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < -this.radius) this.x = width + this.radius;
            if (this.x > width + this.radius) this.x = -this.radius;
            if (this.y < -this.radius) this.y = height + this.radius;
            if (this.y > height + this.radius) this.y = -this.radius;
        }

        draw() {
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.radius
            );
            // using exact brand colors with extreme transparency for a soft blur effect
            gradient.addColorStop(0, this.color + '15'); // 15 hex = ~8% opacity
            gradient.addColorStop(1, 'rgba(0,0,0,0)');

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
        }
    }

    // djubi brand colors
    const colors = ['#a855f7', '#6366f1', '#ec4899'];

    for (let i = 0; i < 4; i++) {
        orbs.push(new Orb(colors[i % colors.length]));
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        orbs.forEach(orb => {
            orb.update();
            orb.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();
});

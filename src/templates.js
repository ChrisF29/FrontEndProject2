/** Starter templates users can pick from the dropdown */
const templates = [
  {
    name: "Blank",
    html: "",
    css: "",
    js: "",
  },
  {
    name: "Hello World",
    html: `<h1>Hello, World!</h1>\n<p>Start editing to see your changes live.</p>`,
    css: `body {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  min-height: 100vh;\n  margin: 0;\n  font-family: sans-serif;\n  background: #0f172a;\n  color: #e2e8f0;\n}\n\nh1 {\n  color: #818cf8;\n}`,
    js: `console.log("Hello from Code Playground!");`,
  },
  {
    name: "CSS Animation",
    html: `<div class="box"></div>`,
    css: `body {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  min-height: 100vh;\n  margin: 0;\n  background: #0f172a;\n}\n\n.box {\n  width: 80px;\n  height: 80px;\n  background: linear-gradient(135deg, #6366f1, #ec4899);\n  border-radius: 16px;\n  animation: spin 2s ease-in-out infinite;\n}\n\n@keyframes spin {\n  0%   { transform: rotate(0deg) scale(1); }\n  50%  { transform: rotate(180deg) scale(1.3); }\n  100% { transform: rotate(360deg) scale(1); }\n}`,
    js: "",
  },
  {
    name: "Fetch API Demo",
    html: `<h2>Random User</h2>\n<div id="user">Loading...</div>`,
    css: `body {\n  font-family: sans-serif;\n  padding: 2rem;\n  background: #0f172a;\n  color: #e2e8f0;\n}\n\n#user {\n  margin-top: 1rem;\n  padding: 1rem;\n  background: #1e293b;\n  border-radius: 8px;\n}`,
    js: `fetch("https://randomuser.me/api/")\n  .then(res => res.json())\n  .then(data => {\n    const u = data.results[0];\n    document.getElementById("user").innerHTML = \`\n      <img src="\${u.picture.medium}" style="border-radius:50%"/>\n      <p><strong>\${u.name.first} \${u.name.last}</strong></p>\n      <p>\${u.email}</p>\n    \`;\n  })\n  .catch(err => {\n    document.getElementById("user").textContent = "Error: " + err.message;\n  });`,
  },
  {
    name: "Canvas Drawing",
    html: `<canvas id="canvas" width="400" height="400"></canvas>`,
    css: `body {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  min-height: 100vh;\n  margin: 0;\n  background: #0f172a;\n}\n\ncanvas {\n  border: 2px solid #334155;\n  border-radius: 8px;\n}`,
    js: `const canvas = document.getElementById("canvas");\nconst ctx = canvas.getContext("2d");\n\nfor (let i = 0; i < 50; i++) {\n  ctx.beginPath();\n  const x = Math.random() * 400;\n  const y = Math.random() * 400;\n  const r = Math.random() * 30 + 5;\n  ctx.arc(x, y, r, 0, Math.PI * 2);\n  ctx.fillStyle = \`hsla(\${Math.random() * 360}, 70%, 60%, 0.6)\`;\n  ctx.fill();\n}`,
  },
];

export default templates;

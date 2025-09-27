"use client";

export default function Page() {
  async function create() {
    const res = await fetch("/api/create-project", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Cat in space",
        scenes: [
          {
            imagePrompt: "cat astronaut floating",
            videoPrompt: "slow zoom, 8 seconds",
            aspectRatio: "16:9",
            use_manipulated_image: true,
          },
        ],
        raw_image_urls: ["https://placekitten.com/800/600"],
        scene_image_indexes: [[0]],
      }),
    });
    const json = await res.json();
    alert(json.id || json.error);
  }

  return <button onClick={create}>Create Project</button>;
}
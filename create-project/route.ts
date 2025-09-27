import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { NextRequest, NextResponse } from "next/server";

const client = new DynamoDBClient({});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const project = {
      id: `proj_${Date.now()}`,               // unique
      title: body.title || "Untitled",
      description: body.description || "",
      status: "pending",                      // cron picks this up
      privacy: body.privacy || "private",
      tags: body.tags || [],
      scenes: body.scenes || [],
      raw_image_urls: body.raw_image_urls || [],
      scene_image_indexes: body.scene_image_indexes || [],
      created_at: new Date().toISOString(),
    };

    await client.send(
      new PutItemCommand({
        TableName: "VideoProjects",
        Item: marshall(project),
      })
    );

    return NextResponse.json({ ok: true, id: project.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
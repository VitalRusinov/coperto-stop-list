import { NextResponse } from "next/server";
import { stopItemPayloadSchema } from "@/entities/menu/model";
import { getMenuStore } from "../../store";

const DELAY_MS = 600;
const ERROR_RATE = 0.2;

function delay() {
  return new Promise((resolve) => setTimeout(resolve, DELAY_MS));
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  await delay();

  const { id } = await context.params;
  const item = getMenuStore().find((entry) => entry.id === id);

  if (!item) {
    return NextResponse.json(
      { message: "Позиция не найдена" },
      { status: 404 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Некорректное тело запроса" },
      { status: 400 },
    );
  }

  const parsed = stopItemPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Некорректные данные" },
      { status: 400 },
    );
  }

  if (Math.random() < ERROR_RATE) {
    return NextResponse.json(
      { message: "Не удалось сохранить" },
      { status: 500 },
    );
  }

  item.status = {
    kind: "stopped",
    reason: parsed.data.reason,
    until: parsed.data.until,
  };
  item.updatedAt = new Date().toISOString();

  return NextResponse.json(item);
}

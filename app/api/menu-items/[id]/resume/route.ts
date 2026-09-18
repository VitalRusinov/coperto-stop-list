import { NextResponse } from "next/server";
import { getMenuStore } from "../../store";

const DELAY_MS = 600;
const ERROR_RATE = 0.2;

function delay() {
  return new Promise((resolve) => setTimeout(resolve, DELAY_MS));
}

export async function POST(
  _request: Request,
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

  if (item.stock === 0) {
    return NextResponse.json(
      { message: "Нельзя вернуть в продажу при нулевом остатке" },
      { status: 409 },
    );
  }

  if (Math.random() < ERROR_RATE) {
    return NextResponse.json(
      { message: "Не удалось сохранить" },
      { status: 500 },
    );
  }

  item.status = { kind: "available" };
  item.updatedAt = new Date().toISOString();

  return NextResponse.json(item);
}

import { NextResponse } from "next/server";
import { menuListQuerySchema } from "@/entities/menu/model";
import { getMenuStore } from "./store";

const DELAY_MS = 600;
const ERROR_RATE = 0.2;

function delay() {
  return new Promise((resolve) => setTimeout(resolve, DELAY_MS));
}

export async function GET(request: Request) {
  await delay();

  const { searchParams } = new URL(request.url);
  const parsed = menuListQuerySchema.safeParse({
    shop: searchParams.has("shop") ? searchParams.get("shop") : undefined,
    status: searchParams.has("status") ? searchParams.get("status") : undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Некорректные фильтры" },
      { status: 400 },
    );
  }

  if (Math.random() < ERROR_RATE) {
    return NextResponse.json(
      { message: "Не удалось загрузить список" },
      { status: 500 },
    );
  }

  const { shop, status } = parsed.data;
  const items = getMenuStore().filter((item) => {
    if (shop && item.shop !== shop) return false;
    if (status && item.status.kind !== status) return false;
    return true;
  });

  return NextResponse.json(items);
}

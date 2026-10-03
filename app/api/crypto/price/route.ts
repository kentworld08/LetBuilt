import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch Bitcoin price");
    }

    const data = await response.json();

    return NextResponse.json({
      bitcoin: data.bitcoin.usd,
    });
  } catch (error) {
    console.error("BTC price API error:", error);

    return NextResponse.json(
      { error: "Failed to fetch BTC price" },
      { status: 500 },
    );
  }
}

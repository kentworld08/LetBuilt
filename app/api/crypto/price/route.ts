import { NextResponse } from "next/server";

export const revalidate = 60;

export async function GET() {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,usd-coin&vs_currencies=usd",
      {
        next: {
          revalidate: 60,
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("CoinGecko error:", response.status, data);

      return NextResponse.json(
        {
          error: "Failed to fetch crypto prices",
        },
        { status: response.status },
      );
    }

    return NextResponse.json({
      bitcoin: Number(data.bitcoin?.usd ?? 0),
      ethereum: Number(data.ethereum?.usd ?? 0),
      tether: Number(data.tether?.usd ?? 0),
      usd_coin: Number(data["usd-coin"]?.usd ?? 0),
    });
  } catch (error) {
    console.error("Crypto price API error:", error);

    return NextResponse.json(
      { error: "Failed to fetch crypto prices" },
      { status: 500 },
    );
  }
}

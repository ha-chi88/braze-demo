"use client";

import * as braze from "@braze/web-sdk";
import { useEffect, useState } from "react";

export default function Page() {
  const [cards, setCards] = useState<braze.Card[]>([]);

  useEffect(() => {
    const initResult = braze.initialize(
      process.env.NEXT_PUBLIC_BRAZE_API_KEY!,
      {
        baseUrl: process.env.NEXT_PUBLIC_BRAZE_SDK_ENDPOINT!,
        enableLogging: true,
      },
    );

    if (initResult) {
      braze.changeUser("test-user-id");
      braze.openSession();
      const subscriptionId = braze.subscribeToContentCardsUpdates((updates) => {
        setCards(updates.cards);
      });
      braze.requestContentCardsRefresh();
      
      return () => {
        if (subscriptionId) {
          braze.removeSubscription(subscriptionId);
        }
      };
    }
  }, []);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Braze Content Cards</h2>
      <div className="space-y-4">
        {cards.map((card) => (
          <CardItem key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}

function CardItem({ card }: { card: braze.Card }) {
  const imageUrl = (card as any).imageUrl;

  return (
    <div>
      {imageUrl && (
        <img src={imageUrl} alt={"Content Card"} width={400} height={400} />
      )}
    </div>
  );
}

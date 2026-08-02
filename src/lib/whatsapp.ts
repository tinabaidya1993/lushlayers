import { CakeItem, CustomizationSelection, OrderFormDetails } from '@/types';

export const BOUTIQUE_WHATSAPP_NUMBER = '918768388868'; // Exact User Phone Number

/**
 * Builds a WhatsApp URL for directly ordering a specific catalog cake
 */
export function buildCakeInquiryWhatsAppUrl(cake: CakeItem, customNotes?: string, selectedWeight?: string, selectedPrice?: number): string {
  const priceVal = selectedPrice || cake?.priceStartingFrom || 0;
  const imageLink = cake?.image ? `🖼️ *Cake Photo (Click to View):*\n${cake.image}\n` : '';

  const text = `Hello *Lush Layers* (Made With Love) 👋✨

I would like to place an inquiry for your signature cake:

🎂 *Cake:* ${cake.name}
✨ *Category:* ${cake.category.toUpperCase()}
💰 *Price:* ₹${priceVal.toLocaleString()}
👥 *Servings/Weight:* ${selectedWeight || cake.servings}
🌱 *Dietary:* ${cake.eggless ? '100% Eggless' : 'Contains Egg'}
🍫 *Flavors:* ${cake.flavors ? cake.flavors.join(', ') : 'Signature'}

${imageLink}
${customNotes ? `📝 *Notes/Date Preference:* ${customNotes}\n` : ''}
Could you please share availability and confirm details for this order?

Thank you! ❤️`;

  return `https://wa.me/${BOUTIQUE_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

/**
 * Builds a WhatsApp URL for a complete One-Page Order Form submission
 */
export function buildOnePageOrderWhatsAppUrl(order: OrderFormDetails): string {
  const priceVal = order.selectedPrice || 0;

  const accessoriesText =
    order.selectedAccessories && order.selectedAccessories.length > 0
      ? order.selectedAccessories.map((a) => `• ${a.name} (+₹${a.price})`).join('\n')
      : 'None';

  const imageLinkText = order.cakeImageUrl
    ? `🖼️ *Cake Photo (Click to View):*\n${order.cakeImageUrl}`
    : '';

  const text = `✨ *LUSH LAYERS (MADE WITH LOVE) — CONFIRMED ORDER* ✨

👤 *Customer Name:* ${order.customerName}
📞 *Phone:* ${order.phoneNumber}
📍 *Delivery Address:* ${order.deliveryAddress}
📅 *Event Date:* ${order.deliveryDate}
⏰ *Delivery Time Slot:* ${order.deliveryTime}

🎂 *Cake Name:* ${order.cakeName} (${(order.cakeCategory || '').toUpperCase()})
⚖️ *Weight / Size:* ${order.selectedWeight}
💰 *Total Order Price:* ₹${priceVal.toLocaleString()}
🌱 *Dietary:* ${order.eggless ? '100% Eggless' : 'Contains Egg'}

${imageLinkText}

🍫 *Selected Flavor:* ${order.selectedFlavor}
🔷 *Cake Shape:* ${order.selectedShape}
🎨 *Theme Color:* ${order.selectedThemeColor}
✍️ *Plaque Lettering:* "${order.cakeMessage || 'None'}"

🎉 *Selected Accessories & Add-ons:*
${accessoriesText}

${order.specialNotes ? `📝 *Special Instructions:* ${order.specialNotes}\n` : ''}
Please confirm availability for my date & send payment details. Thank you! ❤️💫`;

  return `https://wa.me/${BOUTIQUE_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

/**
 * Builds a WhatsApp URL for a bespoke custom cake inquiry
 */
export function buildCustomCakeWhatsAppUrl(selection: CustomizationSelection & { customerName?: string; phoneNumber?: string; deliveryAddress?: string; deliveryTime?: string; cakeCategory?: string }): string {
  const toppingsList = selection.toppings && selection.toppings.length > 0 ? selection.toppings.join(', ') : 'None';
  const refImageLink = selection.referenceImageUrl
    ? `🖼️ *Reference Design Photo (Click to View):*\n${selection.referenceImageUrl}`
    : 'No reference photo attached';

  const text = `✨ *LUSH LAYERS (MADE WITH LOVE) — BESPOKE CUSTOM CAKE INQUIRY* ✨

👤 *Customer Name:* ${selection.customerName || 'Guest Customer'}
📞 *Phone:* ${selection.phoneNumber || 'To be shared'}
📍 *Delivery Address:* ${selection.deliveryAddress || 'To be provided'}
📅 *Event Date:* ${selection.deliveryDate || 'Preferred Date TBD'}
⏰ *Delivery Time Slot:* ${selection.deliveryTime || 'Afternoon'}

🎂 *Requested Category/Theme:* ${selection.cakeCategory || selection.occasion || 'Custom Bespoke Cake'}
⚖️ *Weight / Servings Needed:* ${selection.servings} Guests (${selection.tiers} Tier)
🍫 *Preferred Flavor:* ${selection.spongeFlavor} with ${selection.fillingFlavor}
🔷 *Cake Shape:* ${selection.shape.toUpperCase()}
🎨 *Color Theme / Style:* ${selection.colorPalette}
🌸 *Decorative Accents:* ${toppingsList}

${refImageLink}

✍️ *Custom Plaque Text:* "${selection.customMessage || 'None'}"
📝 *Special Instructions:* ${selection.notes || 'None'}

💬 *Price Estimate:* To be estimated & discussed after reviewing reference image.

Please review my custom reference design and share the price quote & availability. Thank you! ❤️💫`;

  return `https://wa.me/${BOUTIQUE_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

/**
 * General Boutique Inquiry Link
 */
export function buildGeneralInquiryWhatsAppUrl(message?: string): string {
  const defaultText = `Hello *Lush Layers* (Made With Love) 👋✨\n\nI am visiting your website and would love to consult with your head cake artist for a cake order query.`;
  const text = message ? message : defaultText;
  return `https://wa.me/${BOUTIQUE_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

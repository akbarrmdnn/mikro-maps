export async function bagikan({ title, text }) {
  try {
    //web share API (mobile)
    if (navigator.share) {
      await navigator.share({ title, text });
      return; 
    }
  } catch (err) {
  
  }

  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(`${title}\n\n${text}`);
      alert("✅ Link disalin ke clipboard!");
      return;
    }
  } catch (err) {
    console.warn("Clipboard gagal:", err);
  }

  prompt("Copy link ini:", `${title}\n\n${text}`);
}


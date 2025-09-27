"use client";

import { useState } from "react";
import { uploadToIPFS } from "../../lib/pinata";
import { getContract } from "../../lib/nftContract";
import { BrowserProvider } from "ethers";

export default function MintWidget() {
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState("");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setBusy(true);

    try {
      const uri = await uploadToIPFS(file);

      /* ---- mint ---- */
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const nft = getContract(signer);
      const tx = await nft.mint(uri);
      await tx.wait();
      alert(`NFT minted! tx: ${tx.hash}`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      <label className="block">
        <span className="label">Choose media (img/video/3-D/audio)</span>
        <input
          type="file"
          accept="image/*,video/*,audio/*,model/gltf-binary"
          onChange={handleFile}
          disabled={busy}
          className="file-input file-input-bordered w-full"
        />
      </label>

      {preview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="preview" className="rounded max-h-64 mx-auto" />
      )}

      {busy && <p className="text-center">Uploading & minting…</p>}
    </div>
  );
}
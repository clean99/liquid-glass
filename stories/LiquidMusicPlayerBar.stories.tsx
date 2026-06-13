import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LiquidMusicPlayerBar, LiquidProvider, LiquidSearchBox } from "../src";
import { kubeReferenceMusicAlbumAssets } from "./kube-reference-assets";

const meta = {
  title: "Liquid Glass/LiquidMusicPlayerBar",
  component: LiquidMusicPlayerBar,
  parameters: { a11y: { test: "error" } }
} satisfies Meta<typeof LiquidMusicPlayerBar>;

export default meta;
type Story = StoryObj;

const kubeMusicAlbumTitles = [
  "Blues",
  "Electric Ladyland",
  "Are You Experienced",
  "Band of Gypsys",
  "People, Hell and Angels",
  "Axis: Bold as Love",
  "Live at Woodstock",
  "The Cry of Love"
] as const;

export const KubeReference: Story = {
  parameters: {
    visualState: {
      evidence: ["Chrome pageAssets capture", "pnpm test:storybook"],
      profile: "reference",
      states: ["default", "light", "loaded media", "Kube reference"]
    }
  },
  render: () => (
    <LiquidProvider defaultMode="enhanced" disableOnMobile={false} maxEnhancedSurfaces={6}>
      <div
        data-lg-reference-frame="music-player"
        data-lg-theme="light"
        style={{
          position: "relative",
          width: 706,
          height: 420,
          overflow: "hidden",
          padding: 16,
          background: "#fff",
          border: "1px solid rgba(0,0,0,0.1)",
          borderRadius: 10,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif'
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 24,
            transform: "translateX(-50%) scale(0.9)"
          }}
        >
          <LiquidSearchBox
            aria-label="Search music"
            placeholder="Jimi Hendrix"
            surfaceProps={{
              className: "lg-music-player__search",
              radius: 21,
              refraction: {
                blur: 1,
                glassThickness: 92,
                bezelWidth: 20,
                refractiveIndex: 1.5,
                specularOpacity: 0.4
              },
              style: {
                width: 288,
                height: 38,
                padding: "0 14px"
              }
            }}
          />
        </div>
        <h3 style={{ margin: "66px 0 18px", fontSize: 17, fontWeight: 500 }}>Top Results</h3>
        <div
          style={{
            display: "grid",
            gap: 19,
            gridTemplateColumns: "repeat(4, 154px)"
          }}
        >
          {kubeReferenceMusicAlbumAssets.map((album, index) => (
            <div key={album.src}>
              <div
                style={{
                  height: 154,
                  overflow: "hidden",
                  borderRadius: 7,
                  width: 154
                }}
              >
                <img
                  alt=""
                  aria-hidden="true"
                  src={album.src}
                  style={{
                    display: "block",
                    height: "100%",
                    objectFit: "cover",
                    width: "100%"
                  }}
                />
              </div>
              <p
                style={{
                  color: "#111",
                  fontSize: 13,
                  lineHeight: 1.2,
                  margin: "8px 0 0",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  width: 154
                }}
              >
                {kubeMusicAlbumTitles[index] ?? "Album Result"}
              </p>
            </div>
          ))}
        </div>
        <div
          style={{ position: "absolute", left: "50%", bottom: 24, transform: "translateX(-50%)" }}
        >
          <LiquidMusicPlayerBar />
        </div>
      </div>
    </LiquidProvider>
  )
};

import { CommandPalette } from "@/components/command-palette";
import { Vortex } from "@/components/ui/shadcn-io/vortex";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="h-screen w-full overflow-hidden bg-black">
      <Vortex
        backgroundColor="black"
        particleCount={700}
        baseHue={220}
        baseSpeed={0.0}
        rangeSpeed={1.5}
        className="flex items-center justify-center w-full h-full"
      >
        <CommandPalette />
        <div className="backdrop-blur-md bg-white/10 rounded-xl p-8 text-center text-white z-10 max-w-xl mx-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Command Palette</h1>
          <p className="text-lg opacity-90 mb-4">
            Built with the powerful{" "}
            <a
              href="https://react-cmdk.com/"
              target="_blank"
              rel="noreferrer"
              className="underline text-blue-300"
            >
              react-cmdk
            </a>{" "}
            library.
          </p>
          <p className="text-sm text-gray-200">
            Press{" "}
            <kbd className="px-2 py-1 bg-gray-800 rounded text-xs font-mono">Cmd + K</kbd>{" "}
            or{" "}
            <kbd className="px-2 py-1 bg-gray-800 rounded text-xs font-mono">Ctrl + K</kbd>{" "}
            to open the command palette.
          </p>
        </div>
      </Vortex>
    </div>
  );
}

export function readRegistryDistribution(view) {
  const integrity = view?.["dist.integrity"];
  const tarball = view?.["dist.tarball"];
  if (
    !/^sha512-[A-Za-z0-9+/]+={0,2}$/.test(integrity ?? "") ||
    typeof tarball !== "string" ||
    !tarball.startsWith("https://registry.npmjs.org/")
  ) {
    throw new Error("published_sdk_registry_distribution_invalid");
  }
  return { integrity, tarball };
}

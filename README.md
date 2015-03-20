# Dockito provisioner

YAML based Systemd service provisioner.

**This is just a POC, there is not even authentication in place.**

## Provisioning an application

Given a file `sample.fig.yml` with a set of Docker containers to run:

```yaml
jenkins:
  image: jenkins:latest
  ports:
    - 8080
  environment:
    VIRTUAL_HOST: ci.local.dockito.org
    VIRTUAL_PORT: 8080

redis:
  image: redis:latest
```

You can provision it on a CoreOS cluster running this provisioner by simply:

```bash
curl -F my-application=@sample.fig.yml "http://provisioner.local.dockito.org?access-token=C9nQk3waqBDzi3748vxNl5uNBWp57QPe"
```

Where `my-apllication` can be any name to describe your set of services.
